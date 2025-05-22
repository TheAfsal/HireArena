import { IJob } from "@shared/types/job.types";
import * as grpc from "@grpc/grpc-js";
import { JobFilterParams, ServerJobData } from "@core/types/job.types";
export interface IJobService {
  createJob(data: any, userId: string): Promise<any>;

  getAllJobs(jobSeekerId: string): Promise<any[]>;

  getJob(id: string, jobSeekerId: string): Promise<any>;

  getAllJobsBrief(jobSeekerId: string): Promise<any[]>;

  getAllApplications(jobSeekerId: string): Promise<any[]>;

  getApplicationsStatus(jobSeekerId: string, jobId: string): Promise<any>;

  applyForJob(jobId: string, jobSeekerId: string): Promise<any>;

  getCompanyJobs(companyId: string): Promise<any[]>;

  fetchFilteredJobs(filters: any): Promise<{
    jobs: Omit<IJob, "applications">[];
    total: number;
    page: number;
    pageSize: number;
  }>

  isJobExist(
    id: string,
    callback: grpc.sendUnaryData<any>
  ): void;

  fetchJobDetails (ids: string[], callback: grpc.sendUnaryData< any >): void
  getAllJobsForAdmin(params: JobFilterParams): Promise<{ jobs: Omit<IJob, "applications">[]; total: number }>

  updateJob(id: string, data: Partial<ServerJobData>): Promise<Partial<IJob>>
}
