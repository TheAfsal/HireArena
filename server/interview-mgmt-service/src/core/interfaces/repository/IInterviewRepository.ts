// import { IInterviewRounds, IInterviewStatus } from "@core/types/interview.types";
// import { AptitudeTestQuestion, Interview, InterviewStatus } from "@prisma/client";

import { IInterview, IRoundStatus } from "model/Interview";

// export interface IInterviewRepository {
//   getAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string>;
//   getQuestionsByInterviewId(interviewId: string): Promise<AptitudeTestQuestion[]>;
//   progressToNextRound(interviewId: string): Promise<Interview>;
//   updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<Interview>;
//   getTotalAptitudeQuestions(interviewId: string): Promise<number>;
//   getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null>;
//   getInterviewRounds(applicationId: string): Promise<IInterviewRounds | null>;
// }

// import { IInterviewRounds, IInterviewStatus } from "@core/types/interview.types";
// import { AptitudeTestQuestion, Interview, InterviewStatus } from "@prisma/client";
// import { IBaseRepository } from "./IBaseRepository";

// export interface IInterviewRepository extends IBaseRepository<Interview, string> {
//   getAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string>;
//   getQuestionsByInterviewId(interviewId: string): Promise<AptitudeTestQuestion[]>;
//   progressToNextRound(interviewId: string): Promise<Interview>;
//   updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<Interview>;
//   getTotalAptitudeQuestions(interviewId: string): Promise<number>;
//   getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null>;
//   getInterviewRounds(applicationId: string): Promise<IInterviewRounds | null>;
// }

export interface IInterviewRepository {
  findApplicationById(interviewId: string): Promise<IInterview | null>;
  findApplication(
    jobId: string,
    jobSeekerId: string
  ): Promise<IInterview | null>;
  createApplication(jobDetails: Partial<IInterview>): Promise<IInterview>;
  updateAptitudeTestById(interviewId: string, state: IRoundStatus): Promise<void>;
  addAptitudeTestId( interviewId: string, testResultId: string, completed?: boolean): Promise<void>;
  addNextTest(interviewId: string, newTest: Partial<IRoundStatus>): Promise<void>;
  findApplicationByJobId(jobs: string[]): Promise<IInterview[]> 
  // getAptitudeQuestions(interviewId: string): Promise<IAptitudeTestQuestion[] | string>;
  // getQuestionsByInterviewId(interviewId: string): Promise<IAptitudeTestQuestion[]>;
  // progressToNextRound(interviewId: string): Promise<IInterview>;
  // updateInterviewStatus(interviewId: string, status: InterviewStatus): Promise<IInterview>;
  // getTotalAptitudeQuestions(interviewId: string): Promise<number>;
  // getInterviewStatusByApplication(jobId: string, userId: string): Promise<IInterviewStatus | null>;
  // getInterviewRounds(applicationId: string): Promise<IInterviewRounds | null>;
}
