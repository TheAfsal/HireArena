import { IJobApplication } from "@shared/types/job.types";

export interface IJobApplicationRepository {
  findApplication(
    jobId: string,
    jobSeekerId: string
  ): Promise<IJobApplication | null>;
  createApplication(
    jobId: string,
    jobSeekerId: string,
    resumeUrl?: string
  ): Promise<IJobApplication>;
  findJob(jobId: string): Promise<boolean>;
  findAppliedJobs(jobSeekerId: string): Promise<{ jobId: string }[]>;
  findAllByJobSeeker(
    jobSeekerId: string
  ): Promise<
    Omit<
      IJobApplication,
      "id" | "jobId" | "jobSeekerId" | "status" | "appliedAt"
    >[]
  >;
}
