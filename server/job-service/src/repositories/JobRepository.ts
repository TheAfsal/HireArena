import { PrismaClient, Prisma } from "@prisma/client";

class JobRepository {
  private prisma: PrismaClient;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  async createJob(jobData: any) {
    return await this.prisma.job.create({
      data: {
        ...jobData,
        employmentTypes: { create: jobData.employmentTypes.create },
        categories: { create: jobData.categories.create },
        requiredSkills: { create: jobData.requiredSkills.create },
      },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getJobById(jobId: string) {
    return await this.prisma.job.findUnique({ where: { id: jobId } });
  }

  async getAllJobs() {
    return await this.prisma.job.findMany({
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }
}

export default JobRepository;
