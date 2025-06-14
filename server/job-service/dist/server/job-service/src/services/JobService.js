"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const grpcClient_1 = require("../config/grpcClient");
const grpc = __importStar(require("@grpc/grpc-js"));
class JobService {
    constructor(jobRepository, jobApplicationRepository) {
        // async getCompanyByJobId(jobId: string): JobDetails {
        //   return await this.jobRepository.getcompanyName(jobId);
        // }
        // async isJobExist(id: string) {
        //   return await this.jobRepository.getJob(id);
        // }
        this.isJobExist = (id, callback) => {
            this.jobRepository
                .getJob(id)
                .then((details) => {
                if (details) {
                    callback(null, {
                        job: {
                            ...details,
                            testOptions: JSON.stringify(details.testOptions),
                        },
                    });
                }
                else {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Job not found",
                    });
                }
            })
                .catch((err) => {
                callback({
                    code: grpc.status.INTERNAL,
                    details: err.message,
                });
            });
        };
        this.fetchJobDetails = (ids, callback) => {
            this.jobRepository
                .fetchJobsByIds(ids)
                .then((details) => {
                if (details) {
                    const transformedDetails = details.map((job) => ({
                        ...job,
                        testOptions: JSON.stringify(job.testOptions),
                    }));
                    callback(null, { jobs: transformedDetails });
                }
                else {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Job not found",
                    });
                }
            })
                .catch((err) => {
                callback({
                    code: grpc.status.INTERNAL,
                    details: err.message,
                });
            });
        };
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }
    async createJob(data, userId) {
        const companyId = userId ? await (0, grpcClient_1.getCompanyIdByUserId)(userId) : null;
        if (!data.jobTitle || !userId || !companyId) {
            throw new Error("Job title and company ID are required.");
        }
        const testOptions = {
            "Aptitude Test": false,
            "Machine Task": false,
            "Technical Interview": false,
            "Behavioral Interview": false,
            "Coding Challenge": false,
        };
        data.selectedTests.forEach((test) => (testOptions[test] = true));
        const job = await this.jobRepository.createJob({
            jobTitle: data.jobTitle,
            salaryMin: data.salaryRange?.min || 0,
            salaryMax: data.salaryRange?.max || 0,
            jobDescription: data.jobDescription,
            location: data.location,
            responsibilities: data.responsibilities,
            qualifications: data.qualifications,
            niceToHave: data.niceToHave || "",
            benefits: data.benefits || [],
            testOptions,
            companyId,
            employmentTypes: {
                create: data.employmentTypes.map((type) => ({ type })),
            },
            categories: {
                connect: data.categories.map((categoryId) => ({
                    id: categoryId,
                })),
            },
            requiredSkills: {
                connect: data.requiredSkills.map((skillId) => ({
                    id: skillId,
                })),
            },
        });
        try {
            if (testOptions["Aptitude Test"]) {
                const interviewServerResponse = await (0, grpcClient_1.createAptitudeTest)(job.id, companyId);
                console.log("Aptitude Test Created: -----------");
            }
            console.log("@@ testOptions: ", testOptions);
            console.log("@@ testOptions['Machine Task']: ", testOptions["Machine Task"]);
            if (testOptions["Machine Task"]) {
                console.log("123");
                const interviewServerResponse = await (0, grpcClient_1.createMachineTask)(job.id, companyId);
                console.log("Machine Task Created:", interviewServerResponse);
            }
        }
        catch (error) {
            console.log("Test creation failed:", error);
        }
        console.log(4);
        return job;
    }
    async updateJob(id, data) {
        //@ts-ignore
        const updatedJob = await this.jobRepository.update(id, data);
        return updatedJob;
    }
    async getAllJobsForAdmin(page, pageSize, search) {
        const skip = (page - 1) * pageSize;
        return await this.jobRepository.getAllJobsForAdmin(skip, pageSize, search);
    }
    async getAllJobs(jobSeekerId) {
        const jobs = await this.jobRepository.getAllJobs();
        const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(jobSeekerId);
        const appliedJobIds = new Set(appliedJobs.map((app) => app.jobId));
        return jobs.map((job) => ({
            ...job,
            isApplied: appliedJobIds.has(job.id),
        }));
    }
    async getJob(id, jobSeekerId) {
        const job = await this.jobRepository.getJob(id);
        if (!job)
            throw new Error("Job not found");
        const companyDetails = await (0, grpcClient_1.getCompaniesDetails)([job.companyId]);
        const application = await this.jobApplicationRepository.findApplication(id, jobSeekerId);
        return { ...job, ...companyDetails[0], isApplied: !!application };
    }
    async getAllJobsBrief(jobSeekerId) {
        const jobs = await this.jobRepository.getAllJobsBrief();
        const companyIds = [...new Set(jobs.map((job) => job.companyId))];
        const companyDetails = await (0, grpcClient_1.getCompaniesDetails)(companyIds);
        const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(jobSeekerId);
        const appliedJobIds = new Set(appliedJobs.map((job) => job.jobId));
        return jobs.map((job) => {
            const company = companyDetails.find((c) => c.id === job.companyId);
            return {
                ...job,
                companyName: company?.companyName || "Unknown",
                companyLocation: company?.location || null,
                companyLogo: company?.logo || null,
                isApplied: appliedJobIds.has(job.id),
            };
        });
    }
    async getAllApplications(jobSeekerId) {
        const applications = await this.jobApplicationRepository.findAllByJobSeeker(jobSeekerId);
        const companyIds = [
            //@ts-ignore
            ...new Set(applications.map((app) => app.job.companyId)),
        ];
        const companyDetails = await (0, grpcClient_1.getCompaniesDetails)(companyIds);
        return applications.map((app) => {
            //@ts-ignore
            const company = companyDetails.find((c) => c.id === app.job.companyId);
            return {
                //@ts-ignore
                id: app.id,
                //@ts-ignore
                jobTitle: app.job.jobTitle,
                //@ts-ignore
                jobId: app.job.id,
                //@ts-ignore
                companyId: app.job.companyId,
                companyName: company?.companyName || "Unknown",
                companyLogo: company?.logo || null,
                //@ts-ignore
                status: app.status,
                //@ts-ignore
                appliedAt: app.appliedAt,
            };
        });
    }
    async getApplicationsStatus(jobSeekerId, jobId) {
        const application = await this.jobApplicationRepository.findApplication(jobId, jobSeekerId);
        if (!application)
            throw new Error("Application not found");
        return application;
    }
    async applyForJob(jobId, jobSeekerId) {
        const jobExists = await this.jobRepository.getJobById(jobId);
        if (!jobExists)
            throw new Error("Job not found");
        const existingApplication = await this.jobApplicationRepository.findApplication(jobId, jobSeekerId);
        if (existingApplication)
            throw new Error("You have already applied for this job");
        const response = await this.jobApplicationRepository.createApplication(jobId, jobSeekerId);
        return jobExists?.testOptions?.["Aptitude Test"]
            ? { ...response, "Aptitude Test": true }
            : response;
    }
    // async getFilteredJobs(filters: any, jobSeekerId: string): Promise<IJob[]> {
    // const jobs = await this.jobRepository.getJobs(filters);
    // const companyIds = [...new Set(jobs.map((job) => job.companyId))] as string[];
    // const companyDetails = await getCompaniesDetails(companyIds);
    // const appliedJobs = await this.jobApplicationRepository.findAppliedJobs(jobSeekerId);
    // const appliedJobIds = new Set(appliedJobs.map((job) => job.jobId));
    // return jobs.map((job) => {
    //   const company = companyDetails.find((c) => c.id === job.companyId);
    //   return {
    //     ...job,
    //     companyName: company?.companyName || "Unknown",
    //     companyLocation: company?.location || null,
    //     companyLogo: company?.logo || null,
    //     isApplied: appliedJobIds.has(job.id),
    //   };
    // });
    // }
    async getCompanyJobs(companyId) {
        return await this.jobRepository.getJobsByCompany(companyId);
    }
    async fetchFilteredJobs(filters) {
        return await this.jobRepository.getFilteredJobs(filters);
    }
}
exports.default = JobService;
