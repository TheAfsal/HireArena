import {
  FindJobIdsByCompanyId,
  FindJobsByIds,
  IsJobExist,
} from "@config/grpcClient";
import IEmployeeInterviewsRepository from "@core/interfaces/repository/IEmployeeInterviewsRepository";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { IInterviewWithJob } from "@core/types/interview.types";
import {
  IEmployeeInterviews,
  IScheduledInterview,
} from "model/EmployeeInterviews";
import {
  IInterview,
  IRoundStatus,
  RoundStatus,
  RoundType,
} from "model/Interview";
import { v4 as uuidv4 } from "uuid";

export class InterviewService implements IInterviewService {
  constructor(
    private interviewRepo: IInterviewRepository,
    private employeeInterviewsRepo: IEmployeeInterviewsRepository
  ) {}

  async applyForJob(
    jobId: string,
    jobSeekerId: string,
    jobDetails: { id: string; testOptions: JSON; companyId: string }
  ): Promise<Partial<IInterview>> {
    const existingApplication = await this.interviewRepo.findApplication(
      jobId,
      jobSeekerId
    );

    if (existingApplication)
      throw new Error("You have already applied for this job");

    const testOptions: Array<string> = [
      "Aptitude Test",
      "Machine Task",
      "Technical Interview",
      "Behavioral Interview",
      "Coding Challenge",
    ];

    const now = new Date();

    const applicationData: Partial<IInterview> = {
      jobId,
      candidateId: jobSeekerId,
      scheduledAt: now,
      createdAt: now,
      updatedAt: now,
    };

    for (let test of testOptions) {
      if (jobDetails.testOptions[test] === true) {
        applicationData.state = [
          {
            roundType: RoundType[test],
            status: RoundStatus.Scheduled,
            createdAt: now,
            updatedAt: now,
          },
        ];
        if (
          [
            "Technical Interview",
            "Behavioral Interview",
            "Coding Challenge",
          ].includes(test)
        ) {
          applicationData.state[0].status = RoundStatus.Pending;
          applicationData.state[0].scheduledAt = now;
        }
        break;
      }
    }

    return await this.interviewRepo.createApplication(applicationData);
  }

  async getApplicationsStatus(
    jobSeekerId: string,
    jobId: string
  ): Promise<IInterview | null> {
    return await this.interviewRepo.findApplication(jobId, jobSeekerId);
  }

  async findApplicationById(interviewId: string): Promise<IInterview | null> {
    return await this.interviewRepo.findApplicationById(interviewId);
  }

  async getAllApplications(
    userId: string,
    companyId: string
  ): Promise<IInterview[]> {
    const jobs = await FindJobIdsByCompanyId(companyId);
    if (!jobs?.length) {
      return [];
    }

    console.log("@@ job ids from job-server ", jobs);

    return await this.interviewRepo.findApplicationByJobId(jobs);
  }

  async getJobApplications(
    jobId: string
  ): Promise<IInterview[]> {
    console.log("@@ ",jobId);
    
    return await this.interviewRepo.findApplicationByJobId([jobId]);
  }

  async getApplicationsCandidate(userId: string): Promise<IInterviewWithJob[]> {
    const interviews = await this.interviewRepo.findApplicationByCandidateId(
      userId
    );

    if (!interviews.length) return [];

    const jobIds = interviews.map((interview) => interview.jobId);

    const jobs = await FindJobsByIds(jobIds);

    const interviewsWithJobs = interviews.map((interview) => {
      const job = jobs.find((j) => j.id === interview.jobId);

      return {
        ...interview.toObject(),
        jobDetails: job
          ? {
              jobId: job.id,
              title: job.jobTitle,
              testOptions: job.testOptions,
              description: job.jobDescription,
            }
          : undefined,
      };
    });

    return interviewsWithJobs;
  }

  async getScheduleInterviews(userId: string): Promise<IScheduledInterview[]> {
    return await this.employeeInterviewsRepo.findMySchedule(userId);
  }

  async scheduleInterview(
    interviewId: string,
    employeeId: string,
    roundType: RoundType,
    scheduledAt: Date
  ): Promise<IInterview> {
    try {
      // const scheduledInterviewId = Math.random().toString(36).substring(2, 10);
      const scheduledInterviewId = uuidv4();
      const videoCallLink = `http://localhost:3000/job-seeker/video-call/meeting/${scheduledInterviewId}`;

      const scheduledInterview: IScheduledInterview = {
        scheduledInterviewId: interviewId,
        candidateId: "",
        time: scheduledAt,
        link: videoCallLink,
      };

      const interview = await this.interviewRepo.findApplicationById(
        interviewId
      );
      if (!interview) {
        throw new Error("Interview not found");
      }
      scheduledInterview.candidateId = interview.candidateId;

      const updatedScheduledInterview =
        await this.employeeInterviewsRepo.addScheduledInterview(
          employeeId,
          scheduledInterview
        );

      const schema = {
        INTERVIEWER: "Technical Interview",
      };

      const roundData = {
        roundType: schema[roundType],
        status: RoundStatus.Scheduled,
        scheduledAt,
        scheduledInterviewId:
          updatedScheduledInterview.interviews[
            updatedScheduledInterview.interviews.length - 1
          ]["_id"],
        videoCallLink,
      };
      const updatedInterview = await this.interviewRepo.addInterviewRound(
        interviewId,
        roundData
      );

      if (!updatedInterview) {
        throw new Error("Failed to update interview");
      }

      return updatedInterview;
    } catch (error) {
      console.log(error);

      throw new Error(
        `Failed to schedule interview: ${(error as Error).message}`
      );
    }
  }

  async submitVideoInterview(
    interviewId: string,
    candidateId: string,
    employeeId: string,
    remarks: string,
    status: RoundStatus
  ): Promise<IInterview> {
    try {
      const interview = await this.interviewRepo.findApplicationById(
        interviewId
      );
      if (!interview || !interview.state.length) {
        throw new Error("Interview not found or state array is empty");
      }

      const lastRound = interview.state[interview.state.length - 1];
      const scheduledInterviewId = lastRound.scheduledInterviewId;
      if (!scheduledInterviewId) {
        throw new Error("No scheduled interview found to submit");
      }

      const roundData = {
        //@ts-ignore
        ...lastRound.toObject(),
        status,
        remarks,
        completedAt: new Date(),
        scheduledInterviewId: null,
        videoCallLink: null,
      };

      const updatedInterview = await this.interviewRepo.submitVideoInterview(
        interviewId,
        candidateId,
        roundData
      );
      if (!updatedInterview) {
        throw new Error("Failed to update interview");
      }

      const updatedEmployeeSchedule =
        await this.employeeInterviewsRepo.removeScheduledInterview(
          employeeId,
          scheduledInterviewId
        );
      if (!updatedEmployeeSchedule) {
        throw new Error("Failed to update employee schedule");
      }

      if (
        updatedInterview.state[updatedInterview.state.length - 1].status ===
        RoundStatus.Completed
      ) {
        const testOptions: Array<string> = [
          "Technical Interview",
          "Behavioral Interview",
          "HR Interview",
        ];

        console.log("@@ testOptions", testOptions);
        console.log("@@ updatedInterview", updatedInterview);

        const jobDetails = await IsJobExist(updatedInterview.jobId);

        const tests = JSON.parse(jobDetails.job.testOptions);

        console.log("@@ test from job-server: ", tests);

        if (!jobDetails) throw new Error("Job not found");

        const priorityOrder = [
          "Aptitude Test",
          "Machine Task",
          "Coding Challenge",
          "Technical Interview",
          "Behavioral Interview",
          "HR Interview",
          "CEO Interview",
        ];

        const filteredArr = priorityOrder.filter(
          (task) => tests[task] === true
        );

        console.log("@@filteredArr ", filteredArr);

        let nextTest: Partial<IRoundStatus> | null = null;
        const now = new Date();

        if(updatedInterview.state.length===filteredArr.length){
          console.log("Interview Completed"); 
          return updatedInterview
        }else{
          nextTest = {
            roundType: RoundType[filteredArr[updatedInterview.state.length]],
            status: RoundStatus.Pending,
            createdAt: now,
            updatedAt: now,
          };

          console.log(nextTest);
          if (!nextTest) {
            throw new Error("No pending test found to schedule next.");
          }
          return await this.interviewRepo.addNextTest(interviewId, nextTest);
        }
      }

      return updatedInterview;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Failed to submit video interview: ${(error as Error).message}`
      );
    }
  }
}

export default InterviewService;
