import { FindJobIdsByCompanyId, FindJobsByIds } from "@config/grpcClient";
import IEmployeeInterviewsRepository from "@core/interfaces/repository/IEmployeeInterviewsRepository";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { IInterviewWithJob } from "@core/types/interview.types";
import { IScheduledInterview } from "model/EmployeeInterviews";
import { IInterview, RoundStatus, RoundType } from "model/Interview";

export class InterviewService implements IInterviewService {
  constructor(private interviewRepo: IInterviewRepository,
    private employeeInterviewsRepo: IEmployeeInterviewsRepository
  ) {}

  // async fetchAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string> {
  //   return this.interviewRepository.getAptitudeQuestions(interviewId);
  // }

  // async fetchAppliedJobStatus(jobId: string, userId: string): Promise<string> {
  //   const interview =
  //     await this.interviewRepository.getInterviewStatusByApplication(
  //       jobId,
  //       userId
  //     );

  //   if (!interview) {
  //     throw new Error("No interview found for this application.");
  //   }

  //   return interview.status;
  // }

  // Making changes
  
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
        if(["Technical Interview", "Behavioral Interview", "Coding Challenge"].includes(test)){
          applicationData.state[0].status = RoundStatus.Pending
          applicationData.state[0].scheduledAt = now
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

  async findApplicationById(
    interviewId: string,
  ): Promise<IInterview | null> {
    return await this.interviewRepo.findApplicationById(interviewId);
  }

  async getAllApplications(
    userId: string,
    companyId: string,
  ): Promise<IInterview[]> {
    const jobs =await FindJobIdsByCompanyId(companyId)
    if (!jobs?.length) {
      return []
    }

    console.log("@@ job ids from job-server ", jobs);

    return await this.interviewRepo.findApplicationByJobId(jobs);
  }

  async getApplicationsCandidate(userId: string): Promise<IInterviewWithJob[]> {
    console.log(1);
    
    const interviews = await this.interviewRepo.findApplicationByCandidateId(userId);
    console.log(2);
    
    if (!interviews.length) return [];
    
    const jobIds = interviews.map(interview => interview.jobId);
    
    const jobs = await FindJobsByIds(jobIds);
    console.log("@@ jobs",jobs);
    
    const interviewsWithJobs = interviews.map(interview => {
      const job = jobs.find(j => j.id === interview.jobId);
      console.log("@@ # ", job);
      
      return {
        ...interview.toObject(),
        jobDetails: job
        ? {
          jobId: job.id,
          title: job.jobTitle,
          testOptions: job.testOptions,
          description: job.jobDescription,
        }
        : undefined
      };
    });

    console.log(4);

    console.log("@@ interviewsWithJobs", interviewsWithJobs);
    

    return interviewsWithJobs;
  }

  async scheduleInterview(
    interviewId: string,
    employeeId: string, 
    roundType: RoundType,
    scheduledAt: Date
  ): Promise<IInterview> {

    try {
      const scheduledInterviewId = Math.random().toString(36).substring(2, 10);
      // const scheduledInterviewId = uuidv4();
      const videoCallLink = `https://zoom.us/j/scheduledInterviewId`;

      const scheduledInterview: IScheduledInterview = {
        scheduledInterviewId,
        candidateId: "", 
        time: scheduledAt,
        link: videoCallLink
      };

      const interview = await this.interviewRepo.findApplicationById(interviewId);
      if (!interview) {
        throw new Error("Interview not found");
      }
      scheduledInterview.candidateId = interview.candidateId;

      const updatedScheduledInterview = await this.employeeInterviewsRepo.addScheduledInterview(employeeId, scheduledInterview);

      const schema = {
        "INTERVIEWER":"Technical Interview"
      } 

      console.log(schema[roundType]);
      
      console.log("@@ updatedScheduledInterview: ", updatedScheduledInterview);

      const roundData = {
        roundType:schema[roundType],
        status: RoundStatus.Scheduled,
        scheduledAt,
        scheduledInterviewId:updatedScheduledInterview.interviews[updatedScheduledInterview.interviews.length-1]["_id"],
        videoCallLink
      };
      const updatedInterview = await this.interviewRepo.addInterviewRound(interviewId, roundData);


      if (!updatedInterview) {
        throw new Error("Failed to update interview");
      }

      return updatedInterview;
    } catch (error) {
      console.log(error);
      
      throw new Error(`Failed to schedule interview: ${(error as Error).message}`);
    }
  }


  // async getCompanyDetailsById(
  //   companyIds: string[],
  //   callback: grpc.sendUnaryData<{ companies: any[] }>
  // ): Promise<void> {
  //   this.companyRepository
  //     .findByIds(companyIds)
  //     .then((details: ICompany[]) => {
  //       if (details.length) {
  //         console.log(details);
  //         callback(null, { companies: details });
  //       } else {
  //         callback({
  //           code: grpc.status.NOT_FOUND,
  //           details: "Companies not found",
  //         });
  //       }
  //     })
  //     .catch((err: Error) => {
  //       callback({
  //         code: grpc.status.INTERNAL,
  //         details: err.message,
  //       });
  //     });
  // }

}

export default InterviewService;
