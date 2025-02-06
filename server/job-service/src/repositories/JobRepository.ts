import { PrismaClient, Prisma } from "@prisma/client";

class JobRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createJob(jobData: Prisma.JobCreateInput) {
    return this.prisma.job.create({
      data: jobData,
    });
  }
}

export default JobRepository;
