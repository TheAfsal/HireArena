"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobApplicationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findApplication(jobId, jobSeekerId) {
        return await this.prisma.jobApplication.findFirst({
            where: { jobId, jobSeekerId },
        });
    }
    async createApplication(jobId, jobSeekerId, resumeUrl) {
        return await this.prisma.jobApplication.create({
            data: { jobId, jobSeekerId, resumeUrl },
        });
    }
    async findJob(jobId) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        return job !== null;
    }
    async findAppliedJobs(jobSeekerId) {
        return await this.prisma.jobApplication.findMany({
            where: { jobSeekerId },
            select: { jobId: true },
        });
    }
    async findAllByJobSeeker(jobSeekerId) {
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
exports.default = JobApplicationRepository;
