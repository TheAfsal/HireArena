import { IInterviewService } from "@core/interfaces/services/IInterviewService";
import { IInterviewRepository } from "@core/types/interview.types";
import { AptitudeTestQuestion, InterviewStatus } from "@prisma/client";

export class InterviewService implements IInterviewService {
  constructor(private interviewRepository: IInterviewRepository) {}

  async fetchAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string> {
    return this.interviewRepository.getAptitudeQuestions(interviewId);
  }

  async fetchAppliedJobStatus(jobId: string, userId: string): Promise<string> {
    const interview =
      await this.interviewRepository.getInterviewStatusByApplication(
        jobId,
        userId
      );

    if (!interview) {
      throw new Error("No interview found for this application.");
    }

    return interview.status;
  }
}

export default InterviewService;

  // async initiateInterview(applicationId: string, candidateId: string) {
  // Create Interview Entry
  // const interview = await this.interviewRepo.createInterview(
  //   applicationId,
  //   candidateId
  // );

  // Add Aptitude Round
  // await this.interviewRepo.addAptitudeRound(interview.id);

  // return interview;
  // }

  // async getInterviewStatus(candidateId: string) {
  //   return this.interviewRepo.getInterviewByCandidate(candidateId);
  // }
