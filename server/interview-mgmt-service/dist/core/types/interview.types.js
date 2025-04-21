"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export interface ICandidateResponse {
//   id: string;
//   interviewId: string;
//   questionId: string;
//   selectedAnswer: string;
//   isCorrect: boolean | null;
//   submittedAt: Date;
// }
// export interface ICandidateResponsePartial {
//   questionId: string;
//   selectedAnswer: string;
//   isCorrect: boolean | null;
// }
// export interface IInterviewStatus {
//   id: string;
//   status: InterviewStatus;
// }
// export interface IInterviewRounds {
//   InterviewRounds: {
//     status: RoundStatus;
//   }[];
// }
// export interface IMachineTaskDetails extends MachineTask {
//   requirements: MachineTaskRequirement[];
//   evaluationCriteria: MachineTaskEvaluation[];
// }
// export interface IUpdateManyResult {
//   count: number;
// }
// export interface ICandidateResponsePartial {
//   questionId: string;
//   selectedAnswer: string;
//   isCorrect: boolean | null;
// }
// export interface IAptitudeTestResult {
//   interviewId: string;
//   totalQuestions: number;
//   correctCount: number;
//   incorrectCount: number;
//   unansweredCount: number;
//   scorePercentage: number;
//   roundStatus: RoundStatus;
// }
// export interface IInterviewStatus {
//   id: string;
//   status: InterviewStatus;
// }
// export interface IInterviewRepository {
//   getAptitudeQuestions(
//     interviewId: string
//   ): Promise<AptitudeTestQuestion[] | string>;
//   getInterviewStatusByApplication(
//     jobId: string,
//     userId: string
//   ): Promise<IInterviewStatus | null>;
// }
// export interface IMachineTaskDetails extends MachineTask {
//   requirements: MachineTaskRequirement[];
//   evaluationCriteria: MachineTaskEvaluation[];
// }
// export interface IUpdateManyResult {
//   count: number;
// }
// export interface IInterviewRounds {
//   InterviewRounds: { status: RoundStatus }[]; 
// }
// export interface IInterviewStatus {
//   id: string;
// }
// export interface ICandidateResponsePartial {
//   questionId: string;
//   selectedAnswer: string;
//   isCorrect: boolean | null;
// }
// export interface IMachineTaskPartial {
//   id: string;
//   title: string;
//   description: string;
//   hoursToComplete: number;
// }
// export interface IMachineTaskDetails {
//   id: string;
//   jobId: string;
//   companyId: string;
//   title: string;
//   description: string;
//   hoursToComplete: number;
//   createdAt: Date;
//   startTime?: Date;
//   requirements: { id: string; machineTaskId: string; requirement: string }[];
//   evaluationCriteria: { id: string; machineTaskId: string; criteria: string }[];
// }
// export interface IUpdateManyResult {
//   count: number;
// }
// export interface IInterview extends Document {
//   id: string;
//   jobId: string;
//   candidateId: string;
//   applicationId?: string;
//   status: InterviewStatus;
//   createdAt: Date;
// }
// export enum InterviewStatus {
//   Pending = "pending",
//   Scheduled = "scheduled",
//   Completed = "completed",
// }
// export interface IAptitudeTestQuestion extends Document {
//   id: string;
//   templateId: string;
//   question: string;
//   // Add other fields as needed
// }
// export interface IInterviewStatus {
//   id: string;
//   status: InterviewStatus;
// }
// export interface IInterviewRounds {
//   InterviewRounds: any; 
// }
