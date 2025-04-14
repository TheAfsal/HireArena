import { FindJobIdsByCompanyId } from "@config/grpcClient";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { IInterview, RoundStatus, RoundType } from "model/Interview";

export class InterviewService implements IInterviewService {
  constructor(private interviewRepository: IInterviewRepository) {}

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
    const existingApplication = await this.interviewRepository.findApplication(
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
            scheduledAt: now,
            createdAt: now,
            updatedAt: now,
          },
        ];
        break;
      }
    }

    return await this.interviewRepository.createApplication(applicationData);
  }

  async getApplicationsStatus(
    jobSeekerId: string,
    jobId: string
  ): Promise<IInterview | null> {
    return await this.interviewRepository.findApplication(jobId, jobSeekerId);
  }

  async findApplicationById(
    interviewId: string,
  ): Promise<IInterview | null> {
    return await this.interviewRepository.findApplicationById(interviewId);
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

    return await this.interviewRepository.findApplicationByJobId(jobs);
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
