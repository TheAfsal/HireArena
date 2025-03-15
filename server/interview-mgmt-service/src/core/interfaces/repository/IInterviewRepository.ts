import { IInterviewRounds, IInterviewStatus } from "@core/types/interview.types";
import { AptitudeTestQuestion, Interview, InterviewStatus } from "@prisma/client";


export interface IInterviewRepository {
  getAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string>;
  getQuestionsByInterviewId(interviewId: string): Promise<AptitudeTestQuestion[]>;
  progressToNextRound(interviewId: string): Promise<Interview>;
  updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<Interview>;
  getTotalAptitudeQuestions(interviewId: string): Promise<number>;
  getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null>;
  getInterviewRounds(applicationId: string): Promise<IInterviewRounds | null>;
}
