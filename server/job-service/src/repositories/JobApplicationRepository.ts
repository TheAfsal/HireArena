import { IJobApplicationRepository } from "@core/interfaces/repository/IJobApplicationRepository";
import { PrismaClient } from "@prisma/client";
import { IJobApplication } from "@shared/types/job.types";

class JobApplicationRepository implements IJobApplicationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findApplication(
    jobId: string,
    jobSeekerId: string
  ): Promise<IJobApplication | null> {
    return await this.prisma.jobApplication.findFirst({
      where: { jobId, jobSeekerId },
    });
  }

  async createApplication(
    jobId: string,
    jobSeekerId: string,
    resumeUrl?: string
  ): Promise<IJobApplication> {
    return await this.prisma.jobApplication.create({
      data: { jobId, jobSeekerId, resumeUrl },
    });
  }

  async findJob(jobId: string): Promise<boolean> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    return job !== null;
  }

  async findAppliedJobs(jobSeekerId: string): Promise<{ jobId: string }[]> {
    return await this.prisma.jobApplication.findMany({
      where: { jobSeekerId },
      select: { jobId: true },
    });
  }

  async findAllByJobSeeker(
    jobSeekerId: string
  ): Promise<
    Omit<
      IJobApplication,
      "id" | "jobId" | "jobSeekerId" | "status" | "appliedAt"
    >[]
  > {
    return await this.prisma.jobApplication.findMany({
      where: { jobSeekerId },
      include: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            companyId: true,
          },
        },
      },
    });
  }
}

export default JobApplicationRepository;
