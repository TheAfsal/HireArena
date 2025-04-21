"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class JobRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createJob(jobData) {
        return await this.prisma.job.create({
            data: {
                jobTitle: jobData.jobTitle,
                salaryMin: jobData.salaryMin,
                salaryMax: jobData.salaryMax,
                jobDescription: jobData.jobDescription,
                location: jobData.location,
                responsibilities: jobData.responsibilities,
                qualifications: jobData.qualifications,
                testOptions: jobData.testOptions ?? client_1.Prisma.JsonNull,
                niceToHave: jobData.niceToHave,
                benefits: jobData.benefits ?? client_1.Prisma.JsonNull,
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
    async getJobById(jobId) {
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
    async getAllJobsForAdmin(skip, take, search) {
        const where = search
            ? {
                OR: [
                    { jobTitle: { contains: search, mode: "insensitive" } },
                    { jobDescription: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const [jobs, total] = await Promise.all([
            this.prisma.job.findMany({
                skip,
                take,
                //@ts-ignore
                where,
                include: {
                    employmentTypes: true,
                    categories: true,
                    requiredSkills: true,
                },
            }),
            //@ts-ignore
            this.prisma.job.count({ where }),
        ]);
        //@ts-ignore
        return { jobs, total };
    }
    async fetchJobsByIds(jobIds) {
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
    async getJob(id) {
        return await this.prisma.job.findUnique({
            where: { id },
            include: {
                employmentTypes: true,
                categories: true,
                requiredSkills: true,
            },
        });
    }
    async getcompanyName(id) {
        return await this.prisma.job.findUnique({
            where: { id },
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
    async getJobsByCompany(companyId) {
        return await this.prisma.job.findMany({
            where: { companyId },
            include: {
                categories: { select: { name: true } },
                requiredSkills: { select: { name: true } },
                employmentTypes: { select: { type: true, jobId: true, id: true } },
            },
        });
    }
    async getFilteredJobs(filters) {
        const whereClause = { AND: [] };
        // Search in job title or description
        if (filters.searchQuery) {
            whereClause.AND.push({
                OR: [
                    { jobTitle: { contains: filters.searchQuery, mode: "insensitive" } },
                    {
                        jobDescription: {
                            contains: filters.searchQuery,
                            mode: "insensitive",
                        },
                    },
                ],
            });
        }
        // Filter by employment type
        if (filters.type) {
            whereClause.AND.push({
                employmentTypes: { some: { type: filters.type } },
            });
        }
        // Filter by category
        if (filters.category) {
            whereClause.AND.push({
                categories: { some: { name: filters.category } },
            });
        }
        if (filters.skill) {
            whereClause.AND.push({
                requiredSkills: { some: { name: filters.skill } },
            });
        }
        // Filter by level (e.g. Junior, Mid, Senior)
        if (filters.level) {
            whereClause.AND.push({ level: filters.level });
        }
        // Filter by location (case-insensitive match)
        if (filters.location) {
            whereClause.AND.push({
                location: {
                    contains: filters.location,
                    mode: "insensitive",
                },
            });
        }
        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }
        return await this.prisma.job.findMany({
            where: whereClause,
            include: {
                employmentTypes: true,
                categories: true,
                requiredSkills: true,
            },
        });
    }
    async update(id, data) {
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
                employmentTypes: data.employmentTypes ? {
                    deleteMany: {},
                    create: data.employmentTypes.map((et) => ({ type: et.type })),
                } : undefined,
                categories: data.categories ? {
                    set: data.categories.map((cat) => ({ id: cat.id })),
                } : undefined,
                requiredSkills: data.requiredSkills ? {
                    set: data.requiredSkills.map((skill) => ({ id: skill.id })),
                } : undefined,
            },
            include: {
                employmentTypes: true,
                categories: true,
                requiredSkills: true,
            },
        });
    }
}
exports.default = JobRepository;
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
