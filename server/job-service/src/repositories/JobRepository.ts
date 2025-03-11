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
        testOptions: jobData.testOptions,
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

  async getJob(id: string) {
    return await this.prisma.job.findUnique({
      where: {
        id: id,
      },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getAllJobsBrief() {
    return await this.prisma.job.findMany({
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  // async getJobs(filters: any) {
  //   return await this.prisma.job.findMany({
  //     where: {
  //       ...(filters.type && { type: filters.type }),
  //       ...(filters.category && { category: filters.category }),
  //       ...(filters.level && { level: filters.level }),
  //       ...(filters.companyId && { companyId: filters.companyId }),
  //     },
  //     include: {
  //       requiredSkills: true,
  //     },
  //   });
  // }

  async getJobs(filters: any) {
    return await this.prisma.job.findMany({
      where: {
        ...(filters.jobTitle && {
          jobTitle: { contains: filters.jobTitle, mode: "insensitive" },
        }),
        ...(filters.salaryMin && { salaryMin: { gte: filters.salaryMin } }),
        ...(filters.salaryMax && { salaryMax: { lte: filters.salaryMax } }),
        ...(filters.companyId && { companyId: filters.companyId }),

        ...(filters.employmentTypes &&
          Array.isArray(filters.employmentTypes) && {
            employmentTypes: {
              some: {
                type: { in: filters.employmentTypes },
              },
            },
          }),

        ...(filters.categories && {
          categories: {
            some: {
              name: {
                in: Array.isArray(filters.categories)
                  ? filters.categories
                  : [filters.categories],
              },
            },
          },
        }),

        ...(filters.skills && {
          requiredSkills: {
            some: {
              name: {
                in: Array.isArray(filters.skills)
                  ? filters.skills
                  : [filters.skills],
              },
            },
          },
        }),
      },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getJobsByCompany(companyId: string) {
    return await this.prisma.job.findMany({
      where: { companyId },
      include: {
        categories: { select: { name: true } }, // Fetch categories
        requiredSkills: { select: { name: true } }, // Fetch skills
        employmentTypes: { select: { type: true } }, // Employment types
      },
    });
  }

  async getFilteredJobs(filters: any) {
    const whereClause: any = { AND: [] }; // Use AND array to hold all conditions
    console.log(filters);
  
    // Keyword search
    if (filters.searchQuery) {
      whereClause.AND.push({
        OR: [
          { jobTitle: { contains: filters.searchQuery, mode: "insensitive" } },
          { jobDescription: { contains: filters.searchQuery, mode: "insensitive" } },
        ],
      });
    }
  
    // Employment type
    if (filters.type) {
      whereClause.AND.push({
        employmentTypes: { some: { type: filters.type } },
      });
    }
  
    // Category
    if (filters.category) {
      whereClause.AND.push({
        categories: { some: { name: filters.category } },
      });
    }
  
    // Job Level
    if (filters.level) {
      whereClause.AND.push({ level: filters.level });
    }
  
    // If no filters were applied, Prisma expects an empty object
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }
  
    console.log("Final whereClause:", JSON.stringify(whereClause, null, 2));
  
    return await this.prisma.job.findMany({
      where: whereClause,
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }
  
}

export default JobRepository;
