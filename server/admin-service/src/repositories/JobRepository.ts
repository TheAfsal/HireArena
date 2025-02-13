import { PrismaClient, Prisma } from "@prisma/client";

class JobRepository {
  private prisma: PrismaClient;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  async createJob(jobData: any) {
    return await this.prisma.job.create({
      data: {
        jobTitle: jobData.jobTitle,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        jobDescription: jobData.jobDescription,
        responsibilities: jobData.responsibilities,
        qualifications: jobData.qualifications,
        niceToHave: jobData.niceToHave,
        benefits: jobData.benefits,
        companyId: jobData.companyId, 
        employmentTypes: { create: jobData.employmentTypes.create },
        categories: { connect: jobData.categories.connect }, 
        requiredSkills: { connect: jobData.requiredSkills.connect },
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
