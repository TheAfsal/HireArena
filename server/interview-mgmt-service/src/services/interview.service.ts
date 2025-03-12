import { IInterviewService } from "@core/interfaces/services/IInterviewService";

export class InterviewService  implements IInterviewService{
  constructor(private interviewRepository: any) {}

  async fetchAptitudeQuestions(interviewId: string) {
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

    // if (interview.status === "failed") {
    //   return "failed";
    // }

    // if (interview.status === "completed") {
    //   // Check if any round failed
    //   const interviewRounds = await this.interviewRepository.getInterviewRounds(
    //     applicationId
    //   );

    //   if (
    //     interviewRounds &&
    //     interviewRounds.InterviewRounds.some(
    //       (round) => round.status === "failed"
    //     )
    //   ) {
    //     return "failed";
    //   }

    //   return "passed";
    // }

    // return "pending";
    return interview.status;
  }

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
}
