import { ICandidateResponse, ICandidateResponsePartial } from "@core/types/interview.types";

export interface ICandidateResponseRepository {
  saveCandidateResponse(
    interviewId: string,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean
  ): Promise<ICandidateResponse>;

  getResponsesByInterviewId(interviewId: string): Promise<ICandidateResponsePartial[]>;
}