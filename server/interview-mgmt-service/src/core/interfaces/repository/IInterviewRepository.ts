import { AptitudeTestQuestion, InterviewStatus } from "@prisma/client";

export interface IInterviewRepository {
  getAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string>;
  getQuestionsByInterviewId(interviewId: string): Promise<AptitudeTestQuestion[]>;
  progressToNextRound(interviewId: string): Promise<any>;
  updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<any>;
  getTotalAptitudeQuestions(interviewId: string): Promise<number>;
  getInterviewStatusByApplication(jobId: string, userId: string): Promise<any>;
  getInterviewRounds(applicationId: string): Promise<any>;
}

