import {
  AptitudeTestQuestion,
  InterviewStatus,
  MachineTask,
  MachineTaskEvaluation,
  MachineTaskRequirement,
  RoundStatus,
} from "@prisma/client";

export interface ICandidateResponse {
  id: string;
  interviewId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean | null;
  submittedAt: Date;
}

export interface ICandidateResponsePartial {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean | null;
}

export interface IInterviewStatus {
  id: string;
  status: InterviewStatus;
}

export interface IInterviewRounds {
  InterviewRounds: {
    status: RoundStatus;
  }[];
}

export interface IMachineTaskPartial {
  id: string;
  title: string;
  description: string;
  hoursToComplete: number;
}

export interface IMachineTaskDetails extends MachineTask {
  requirements: MachineTaskRequirement[];
  evaluationCriteria: MachineTaskEvaluation[];
}

export interface IUpdateManyResult {
  count: number;
}

export interface ICandidateResponsePartial {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean | null;
}
export interface IAptitudeTestResult {
  interviewId: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scorePercentage: number;
  roundStatus: RoundStatus;
}

export interface IInterviewStatus {
  id: string;
  status: InterviewStatus;
}

export interface IInterviewRepository {
  getAptitudeQuestions(
    interviewId: string
  ): Promise<AptitudeTestQuestion[] | string>;
  getInterviewStatusByApplication(
    jobId: string,
    userId: string
  ): Promise<IInterviewStatus | null>;
}

export interface IMachineTaskPartial {
  id: string;
  title: string;
  description: string;
  hoursToComplete: number;
}

export interface IMachineTaskDetails extends MachineTask {
  requirements: MachineTaskRequirement[];
  evaluationCriteria: MachineTaskEvaluation[];
}

export interface IUpdateManyResult {
  count: number;
}
