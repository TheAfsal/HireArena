import {
  CreateNotification,
  FindJobIdsByCompanyId,
  FindJobsByIds,
  GetJobSeekerDetailsById,
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

export interface PaginationOptions {
  page: number;
  pageSize: number;
  roundType?: string;
}

interface IJob {
  id: string;
  jobTitle: string;
}

interface IJobSeeker {
  id: string;
  fullName: string;
  email: string;
  image: string;
}
interface EnrichedInterview extends IInterview {
  jobTitle: string | null;
  candidate: {
    id: string;
    fullName: string;
    email: string;
    image: string;
  } | null;
}

export interface IApplicationsResponse {
  applications: EnrichedInterview[];
  total: number;
  page: number;
  pageSize: number;
}
export interface IApplicationOptions {
  page: string;
  pageSize: string;
  roundType?: string;
}

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

    const existingJob = await FindJobsByIds([jobId]);

    console.log("@@ existingJob - ", existingJob);

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

    const createdApplication = await this.interviewRepo.createApplication(
      applicationData
    );

    await CreateNotification({
      userId: jobSeekerId,
      message: `You applied for job ${existingJob[0].jobTitle}`,
      type: "INTERVIEW_COMPLETED",
      relatedId: jobId,
    });

    return createdApplication;
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
    companyId: string,
    options: IApplicationOptions
  ): Promise<IApplicationsResponse> {
    const jobs: string[] = await FindJobIdsByCompanyId(companyId);

    if (!jobs || jobs.length === 0) {
      return { applications: [], total: 0, page: 1, pageSize: 10 };
    }

    const page = parseInt(options.page, 10) || 1;
    const pageSize = parseInt(options.pageSize, 10) || 10;
    const roundType = options.roundType;

    const { applications, total } =
      await this.interviewRepo.findApplicationByJobId(jobs, {
        page,
        pageSize,
        roundType,
      });

    const uniqueCandidateIds = Array.from(
      new Set(applications.map((app) => app.candidateId))
    );

    const [jobDetails, jobSeekerDetails] = await Promise.all([
      FindJobsByIds(jobs),
      GetJobSeekerDetailsById(uniqueCandidateIds),
    ]);

    const jobMap = new Map<string, string>(
      jobDetails.map((job) => [job.id, job.jobTitle])
    );

    const seekerMap = new Map<string, IJobSeeker>(
      //@ts-ignore
      jobSeekerDetails.jobSeekers.map((seeker) => [seeker.id, seeker])
    );

    //@ts-ignore
    const enrichedApplications: EnrichedInterview[] = applications.map(
      (app) => ({
        ...app.toObject(),
        jobTitle: jobMap.get(app.jobId) || null,
        candidate: seekerMap.has(app.candidateId)
          ? {
              id: seekerMap.get(app.candidateId)!.id,
              fullName: seekerMap.get(app.candidateId)!.fullName,
              email: seekerMap.get(app.candidateId)!.email,
              image: seekerMap.get(app.candidateId)!.image,
            }
          : null,
      })
    );

    return {
      applications: enrichedApplications,
      total,
      page,
      pageSize,
    };
  }

  async getAllApplicationsDashboard(
    userId: string,
    companyId: string
  ): Promise<any[]> {
    const jobs = await FindJobIdsByCompanyId(companyId);

    if (!jobs || jobs.length === 0) {
      return [];
    }

    const interviews = await this.interviewRepo.getJobApplications(jobs);
    const uniqueCandidateIds = Array.from(
      new Set(interviews.map((app: any) => app.candidateId))
    );

    try {
      const [userDetailsResult, jobDetails] = await Promise.all([
        GetJobSeekerDetailsById(uniqueCandidateIds),
        FindJobsByIds(jobs),
      ]);

      const jobSeekers = (
        userDetailsResult as {
          jobSeekers: {
            id: string;
            fullName: string;
            email: string;
            image?: string;
          }[];
        }
      ).jobSeekers;

      const candidateMap = new Map(jobSeekers.map((js: any) => [js.id, js]));
      const jobMap = new Map(
        jobDetails.map((job: any) => [job.id, job.jobTitle])
      );

      return interviews.map((interview: any) => {
        const {
          _id,
          jobId,
          candidateId,
          state,
          scheduledAt,
          createdAt,
          updatedAt,
        } = interview._doc;

        return {
          id: _id.toString(),
          jobId,
          jobTitle: jobMap.get(jobId) || null,
          candidateId,
          state,
          scheduledAt,
          createdAt,
          updatedAt,
          candidate: candidateMap.has(candidateId)
            ? {
                id: candidateMap.get(candidateId)!.id,
                fullName: candidateMap.get(candidateId)!.fullName,
                email: candidateMap.get(candidateId)!.email,
                image: candidateMap.get(candidateId)!.image || null,
              }
            : null,
        };
      });
    } catch (error) {
      throw new Error("Failed to fetch candidate or job details");
    }
  }

  async getJobApplications(jobId: string): Promise<any[]> {
    const applications = await this.interviewRepo.getJobApplications([jobId]);

    if (!applications || applications.length === 0) {
      return [];
    }

    const uniqueCandidateIds = Array.from(
      new Set(applications.map((app: any) => app.candidateId))
    );

    try {
      const userDetailsResult = await GetJobSeekerDetailsById(
        uniqueCandidateIds
      );
      const jobSeekers = (
        userDetailsResult as {
          jobSeekers: {
            id: string;
            fullName: string;
            email: string;
            image?: string;
          }[];
        }
      ).jobSeekers;

      const candidateMap = new Map(jobSeekers.map((js: any) => [js.id, js]));

      return applications.map((app: any) => {
        const {
          _id,
          jobId,
          candidateId,
          state,
          scheduledAt,
          createdAt,
          updatedAt,
        } = app;

        return {
          id: _id.toString(),
          jobId,
          candidateId,
          state,
          scheduledAt,
          createdAt,
          updatedAt,
          candidate: candidateMap.has(candidateId)
            ? {
                id: candidateMap.get(candidateId)!.id,
                fullName: candidateMap.get(candidateId)!.fullName,
                email: candidateMap.get(candidateId)!.email,
                image: candidateMap.get(candidateId)!.image || null,
              }
            : null,
        };
      });
    } catch (error) {
      throw new Error("Failed to fetch candidate details");
    }
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

  async getScheduleInterviews(userId: string): Promise<any[]> {
    const interviews = await this.employeeInterviewsRepo.findMySchedule(userId);

    if (!interviews || interviews.length === 0) {
      return [];
    }

    const uniqueCandidateIds = Array.from(
      new Set(interviews.map((i: any) => i.candidateId))
    );

    try {
      const userDetailsResult = await GetJobSeekerDetailsById(
        uniqueCandidateIds
      );
      const jobSeekers = (
        userDetailsResult as {
          jobSeekers: {
            id: string;
            fullName: string;
            email: string;
            image?: string;
          }[];
        }
      ).jobSeekers;

      const candidateMap = new Map(jobSeekers.map((js: any) => [js.id, js]));

      return interviews.map((interview: any) => {
        const { _id, scheduledInterviewId, candidateId, time, link } =
          interview;

        return {
          _id,
          scheduledInterviewId,
          candidateId,
          time,
          link,
          candidate: candidateMap.has(candidateId)
            ? {
                id: candidateMap.get(candidateId)!.id,
                fullName: candidateMap.get(candidateId)!.fullName,
                email: candidateMap.get(candidateId)!.email,
                image: candidateMap.get(candidateId)!.image || null,
              }
            : null,
        };
      });
    } catch (error) {
      throw new Error("Failed to fetch candidate details");
    }
  }

  async scheduleInterview(
    interviewId: string,
    employeeId: string,
    roundType: RoundType,
    scheduledAt: Date
  ): Promise<IInterview> {
    try {
      const scheduledInterviewId = uuidv4();
      const videoCallLink = `/job-seeker/video-call/meeting/${scheduledInterviewId}`;

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

      const existingJob = await FindJobsByIds([interview.jobId]);

      await CreateNotification({
        userId: interview.candidateId,
        message: `${roundData.roundType} scheduled for ${existingJob[0].jobTitle}`,
        type: "INTERVIEW_COMPLETED",
        relatedId: interview.jobId,
      });

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

        if (updatedInterview.state.length === filteredArr.length) {
          console.log("Interview Completed");

          const existingJob = await FindJobsByIds([interview.jobId]);

          await CreateNotification({
            userId: interview.candidateId,
            message: `${existingJob[0].jobTitle} Interview completed successfully`,
            type: "INTERVIEW_COMPLETED",
            relatedId: interview.jobId,
          });

          return updatedInterview;
        } else {
          nextTest = {
            roundType: RoundType[filteredArr[updatedInterview.state.length]],
            status: RoundStatus.Pending,
            createdAt: now,
            updatedAt: now,
          };

          const existingJob = await FindJobsByIds([interview.jobId]);

          await CreateNotification({
            userId: interview.candidateId,
            message: `${nextTest.roundType} scheduled for ${existingJob[0].jobTitle}`,
            type: "INTERVIEW_COMPLETED",
            relatedId: interview.jobId,
          });

          console.log(nextTest);
          if (!nextTest) {
            throw new Error("No pending test found to schedule next.");
          }
          return await this.interviewRepo.addNextTest(interviewId, nextTest);
        }
      }
      
      const existingJob = await FindJobsByIds([interview.jobId]);

      await CreateNotification({
        userId: interview.candidateId,
        message: `Falied interview for ${existingJob[0].jobTitle}`,
        type: "INTERVIEW_COMPLETED",
        relatedId: interview.jobId,
      });

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
