import { IJobRepository } from "@core/interfaces/repository/IJobRepository";
import { IJobCreateInput, IJobResponse, JobFilterParams, JobFilters } from "@core/types/job.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { IJob } from "@shared/types/job.types";

class JobRepository implements IJobRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createJob(
    jobData: IJobCreateInput
  ): Promise<
    Omit<
      IJob,
      "employmentTypes" | "categories" | "requiredSkills" | "applications"
    >
  > {
    return await this.prisma.job.create({
      data: {
        jobTitle: jobData.jobTitle,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        jobDescription: jobData.jobDescription,
        location: jobData.location,
        responsibilities: jobData.responsibilities,
        qualifications: jobData.qualifications,
        testOptions: jobData.testOptions ?? Prisma.JsonNull,
        niceToHave: jobData.niceToHave,
        benefits: jobData.benefits ?? Prisma.JsonNull,
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

  async getJobById(
    jobId: string
  ): Promise<Omit<
    IJob,
    "employmentTypes" | "categories" | "requiredSkills" | "applications"
  > | null> {
    return await this.prisma.job.findUnique({ where: { id: jobId } });
  }

  async getAllJobs(): Promise<Omit<IJob, "applications">[]> {
    return await this.prisma.job.findMany({
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getAllJobsForAdmin({
    //@ts-ignore
    skip,
    //@ts-ignore
    take,
    search,
    sortBy = "updatedAt",
    sortOrder = "desc",
    startDate,
    endDate,
    status,
    department,
  }: JobFilterParams): Promise<{ jobs: Omit<IJob, "applications">[]; total: number }> {
    const where: any = {};

    if (search) {
      where.OR = [
        { jobTitle: { contains: search, mode: "insensitive" } },
        { jobDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    if (startDate || endDate) {
      where.updatedAt = {};
      if (startDate) {
        where.updatedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.updatedAt.lte = new Date(endDate);
      }
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        skip,
        take,
        where,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { updatedAt: "desc" },
        include: {
          employmentTypes: true,
          categories: true,
          requiredSkills: true,
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return { jobs, total };
  }

  async fetchJobsByIds(
    jobIds: string[]
  ): Promise<Omit<IJob, "applications">[]> {
    const jobs = await this.prisma.job.findMany({
      where: {
        id: {
          in: jobIds,
        },
      },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });

    return jobs;
  }

  async getJob(id: string): Promise<Omit<IJob, "applications"> | null> {
    return await this.prisma.job.findUnique({
      where: { id },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getcompanyName(id: string): Promise<Pick<IJob, "jobTitle"> | null> {
    return await this.prisma.job.findUnique({
      where: { id },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getAllJobsBrief(): Promise<Omit<IJob, "applications">[]> {
    return await this.prisma.job.findMany({
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }

  async getJobsByCompany(companyId: string): Promise<IJobResponse[]> {
    return await this.prisma.job.findMany({
      where: { companyId },
      include: {
        categories: { select: { name: true } },
        requiredSkills: { select: { name: true } },
        employmentTypes: { select: { type: true, jobId: true, id: true } },
      },
    });
  }

  async getFilteredJobs(filters: JobFilters): Promise<{
    jobs: Omit<IJob, "applications">[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const {
      searchQuery,
      type,
      category,
      level,
      skill,
      location,
      page = "1",
      pageSize = "10"
    } = filters;

    // Parse pagination parameters
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;
    const skip = (pageNum - 1) * pageSizeNum;

    // Build where clause
    const where: Prisma.JobWhereInput = {};

    if (searchQuery) {
      where.OR = [
        { jobTitle: { contains: searchQuery, mode: "insensitive" } },
        { jobDescription: { contains: searchQuery, mode: "insensitive" } }
      ];
    }

    if (type) {
      where.employmentTypes = { some: { type: { equals: type } } }; // Use enum filter
    }

    if (category) {
      where.categories = { some: { name: { equals: category } } };
    }

    if (skill) {
      where.requiredSkills = { some: { name: { equals: skill } } };
    }

    if (level) {
      where.qualifications = { contains: level, mode: "insensitive" };
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    console.log("@@ whereClause:", JSON.stringify(where, null, 2));

    // Fetch jobs and total count
    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        select: {
          id: true,
          jobTitle: true,
          salaryMin: true,
          salaryMax: true,
          jobDescription: true,
          location: true,
          responsibilities: true,
          qualifications: true,
          testOptions: true,
          niceToHave: true,
          benefits: true,
          companyId: true,
          createdAt: true,
          updatedAt: true,
          employmentTypes: {
            select: { type: true }
          },
          categories: {
            select: { name: true }
          },
          requiredSkills: {
            select: { name: true }
          }
        },
        skip,
        take: pageSizeNum
      }),
      this.prisma.job.count({ where })
    ]);

    return {
      //@ts-ignore
      jobs,
      total,
      page: pageNum,
      pageSize: pageSizeNum
    };
  }

  // async getFilteredJobs(filters: {
  //   searchQuery?: string;
  //   type?: string;
  //   category?: string;
  //   level?: string;
  //   skill?: string;
  //   location?: string;
  // }): Promise<Omit<IJob, "applications">[]> {
  //   const whereClause: any = { AND: [] };

  //   // Search in job title or description
  //   if (filters.searchQuery) {
  //     whereClause.AND.push({
  //       OR: [
  //         { jobTitle: { contains: filters.searchQuery, mode: "insensitive" } },
  //         {
  //           jobDescription: {
  //             contains: filters.searchQuery,
  //             mode: "insensitive",
  //           },
  //         },
  //       ],
  //     });
  //   }

  //   // Filter by employment type
  //   if (filters.type) {
  //     whereClause.AND.push({
  //       employmentTypes: { some: { type: filters.type } },
  //     });
  //   }

  //   // Filter by category
  //   if (filters.category) {
  //     whereClause.AND.push({
  //       categories: { some: { name: filters.category } },
  //     });
  //   }

  //   if (filters.skill) {
  //     whereClause.AND.push({
  //       requiredSkills: { some: { name: filters.skill } },
  //     });
  //   }

  //   // Filter by level (e.g. Junior, Mid, Senior)
  //   if (filters.level) {
  //     whereClause.AND.push({ level: filters.level });
  //   }

  //   // Filter by location (case-insensitive match)
  //   if (filters.location) {
  //     whereClause.AND.push({
  //       location: {
  //         contains: filters.location,
  //         mode: "insensitive",
  //       },
  //     });
  //   }

  //   console.log("@@ whereClause: ", whereClause);

  //   if (whereClause.AND.length === 0) {
  //     delete whereClause.AND;
  //   }

  //   return await this.prisma.job.findMany({
  //     where: whereClause,
  //     include: {
  //       employmentTypes: true,
  //       categories: true,
  //       requiredSkills: true,
  //     },
  //   });
  // }

  async update(
    id: string,
    data: Partial<
      IJob & {
        employmentTypes?: { type: string }[];
        categories?: { id: string }[];
        requiredSkills?: { id: string }[];
      }
    >
  ): Promise<Partial<IJob>> {
    return this.prisma.job.update({
      where: { id },
      data: {
        jobTitle: data.jobTitle,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        location: data.location,
        jobDescription: data.jobDescription,
        responsibilities: data.responsibilities,
        qualifications: data.qualifications,
        niceToHave: data.niceToHave,
        benefits: data.benefits,
        testOptions: data.testOptions,
        //@ts-ignore
        employmentTypes: data.employmentTypes
          ? {
              deleteMany: {},
              create: data.employmentTypes.map((et) => ({ type: et.type })),
            }
          : undefined,
        categories: data.categories
          ? {
              set: data.categories.map((cat) => ({ id: cat.id })),
            }
          : undefined,
        requiredSkills: data.requiredSkills
          ? {
              set: data.requiredSkills.map((skill) => ({ id: skill.id })),
            }
          : undefined,
      },
      include: {
        employmentTypes: true,
        categories: true,
        requiredSkills: true,
      },
    });
  }
}

export default JobRepository;

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

// async getJobs(filters: any) {
//   return await this.prisma.job.findMany({
//     where: {
//       ...(filters.jobTitle && {
//         jobTitle: { contains: filters.jobTitle, mode: "insensitive" },
//       }),
//       ...(filters.salaryMin && { salaryMin: { gte: filters.salaryMin } }),
//       ...(filters.salaryMax && { salaryMax: { lte: filters.salaryMax } }),
//       ...(filters.companyId && { companyId: filters.companyId }),

//       ...(filters.employmentTypes &&
//         Array.isArray(filters.employmentTypes) && {
//           employmentTypes: {
//             some: {
//               type: { in: filters.employmentTypes },
//             },
//           },
//         }),

//       ...(filters.categories && {
//         categories: {
//           some: {
//             name: {
//               in: Array.isArray(filters.categories)
//                 ? filters.categories
//                 : [filters.categories],
//             },
//           },
//         },
//       }),

//       ...(filters.skills && {
//         requiredSkills: {
//           some: {
//             name: {
//               in: Array.isArray(filters.skills)
//                 ? filters.skills
//                 : [filters.skills],
//             },
//           },
//         },
//       }),
//     },
//     include: {
//       employmentTypes: true,
//       categories: true,
//       requiredSkills: true,
//     },
//   });
// }
