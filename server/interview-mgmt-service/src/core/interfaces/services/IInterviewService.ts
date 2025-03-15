import { AptitudeTestQuestion } from "@prisma/client";

export interface IInterviewService {
  fetchAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string>;
  fetchAppliedJobStatus(jobId: string, userId: string): Promise<string>;
}