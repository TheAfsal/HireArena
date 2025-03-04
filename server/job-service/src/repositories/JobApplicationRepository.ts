import { PrismaClient, JobApplication } from "@prisma/client";

class JobApplicationRepository {
    private prisma: PrismaClient;

    constructor(prisma: any) {
      this.prisma = prisma;
    }
  async findApplication(jobId: string, jobSeekerId: string): Promise<JobApplication | null> {
    return await this.prisma.jobApplication.findFirst({
      where: { jobId, jobSeekerId },
    });
  } 

  async createApplication(jobId: string, jobSeekerId: string, resumeUrl?: string): Promise<JobApplication> {
    return await this.prisma.jobApplication.create({
      data: { jobId, jobSeekerId, resumeUrl },
    });
  }

  async findJob(jobId: string): Promise<boolean> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    return !!job;
  }

  async findAppliedJobs(jobSeekerId: string) {
    return await this.prisma.jobApplication.findMany({
      where: {
        jobSeekerId,
      },
      select: {
        jobId: true, 
      },
    });
  }

  async findAllByJobSeeker(jobSeekerId: string) {
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
