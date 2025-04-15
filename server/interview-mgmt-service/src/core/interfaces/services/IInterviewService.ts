import { IInterview, RoundType } from "model/Interview";

export interface IInterviewService {
  applyForJob(
    jobId: string,
    jobSeekerId: string,
    jobDetails: { id: string; testOptions: JSON; companyId: string }
  ): Promise<Partial<IInterview>>;
  getApplicationsStatus(
    jobSeekerId: string,
    jobId: string
  ): Promise<IInterview | null>;
  findApplicationById(interviewId: string): Promise<IInterview | null>;
  getAllApplications(userId: string, companyId: string ): Promise<IInterview[]>
  scheduleInterview( interviewId: string, employeeId: string, roundType: RoundType, scheduledAt: Date): Promise<IInterview>
  getApplicationsCandidate( userId: string ): Promise<IInterview[]>
  // fetchAptitudeQuestions(interviewId: string): Promise<AptitudeTestQuestion[] | string>;
  // fetchAppliedJobStatus(jobId: string, userId: string): Promise<string>;
}
