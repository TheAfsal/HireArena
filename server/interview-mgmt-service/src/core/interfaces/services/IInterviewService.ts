import { IApplicationOptions, IApplicationsResponse, PaginationOptions } from "@services/interview.service";
import { IScheduledInterview } from "model/EmployeeInterviews";
import { IInterview, RoundStatus, RoundType } from "model/Interview";

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
  scheduleInterview(
    interviewId: string,
    employeeId: string,
    roundType: RoundType,
    scheduledAt: Date
  ): Promise<IInterview>;
  getApplicationsCandidate(userId: string): Promise<IInterview[]>;
  getScheduleInterviews(userId: string): Promise<IScheduledInterview[]>;
  submitVideoInterview(
    interviewId: string,
    candidateId: string,
    employeeId: string,
    remarks: string,
    status: RoundStatus
  ): Promise<IInterview>;
  getJobApplications(jobId: string): Promise<IInterview[]>;
  getAllApplications(
    userId: string,
    companyId: string,
    options: {
      page: string;
      pageSize: string;
      roundType?: string;
    }
  ): Promise<{
    applications: IInterview[];
    total: number;
    page: number;
    pageSize: number;
  }> 
  getAllApplicationsDashboard(
    userId: string,
    companyId: string
  ): Promise<IInterview[]> 
  getAllApplications(
    userId: string,
    companyId: string,
    options: IApplicationOptions
  ): Promise<IApplicationsResponse> 
}
