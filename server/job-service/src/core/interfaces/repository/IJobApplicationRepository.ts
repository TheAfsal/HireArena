// src/interfaces/IJobApplicationRepository.ts
import { JobApplication } from "@prisma/client";

export interface IJobApplicationRepository {
  findApplication(
    jobId: string,
    jobSeekerId: string
  ): Promise<JobApplication | null>;
  createApplication(
    jobId: string,
    jobSeekerId: string,
    resumeUrl?: string
  ): Promise<JobApplication>;
  findJob(jobId: string): Promise<boolean>;
  findAppliedJobs(jobSeekerId: string): Promise<{ jobId: string }[]>;
  findAllByJobSeeker(jobSeekerId: string): Promise<JobApplication[]>;
}
