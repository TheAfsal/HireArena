import { IJobCreateInput, IJobResponse } from "@core/types/job.types";
import { IJob } from "@shared/types/job.types";

export interface IJobRepository {
  createJob(
    jobData: IJobCreateInput
  ): Promise<
    Omit<
      IJob,
      "employmentTypes" | "categories" | "requiredSkills" | "applications"
    >
  >;

  getJobById(
    jobId: string
  ): Promise<Omit<
    IJob,
    "employmentTypes" | "categories" | "requiredSkills" | "applications"
  > | null>;

  getAllJobs(): Promise<Omit<IJob, "applications">[]>;

  getJob(id: string): Promise<Omit<IJob, "applications"> | null>;

  getAllJobsBrief(): Promise<Omit<IJob, "applications">[]>;

  getJobsByCompany(companyId: string): Promise<IJobResponse[]>;

  getFilteredJobs(filters: {
    searchQuery?: string;
    type?: string;
    category?: string;
    level?: string;
  }): Promise<Omit<IJob, "applications">[]>;

  fetchJobsByIds(jobIds: string[]): Promise<Omit<IJob, "applications">[]>
  getAllJobsForAdmin(skip: number, take: number, search: string): Promise<{ jobs: Omit<IJob, "applications">[], total: number }>
}
