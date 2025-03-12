import { Job } from "@prisma/client";

export interface IJobRepository {
  createJob(jobData: any): Promise<Job>;
  getJobById(jobId: string): Promise<Job | null>;
  getAllJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | null>;
  getAllJobsBrief(): Promise<Job[]>;
  getJobs(filters: any): Promise<Job[]>;
  getJobsByCompany(companyId: string): Promise<Job[]>;
  getFilteredJobs(filters: any): Promise<Job[]>;
}
