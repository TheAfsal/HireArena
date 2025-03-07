
export class InterviewService {
  constructor(private interviewRepository: any) {}

  async fetchAptitudeQuestions(interviewId: string) {
    return this.interviewRepository.getAptitudeQuestions(interviewId);
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
