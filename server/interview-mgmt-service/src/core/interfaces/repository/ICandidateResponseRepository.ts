export interface ICandidateResponseRepository {
  saveCandidateResponse(
    interviewId: string,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean
  ): Promise<any>;
  getResponsesByInterviewId(interviewId: string): Promise<any>;
}
