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
class JobController {
    constructor(jobService) {
        this.createJob = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const job = await this.jobService.createJob(req.body, userId);
                res.status(201).json({ message: "Job created successfully", job });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            }
        };
        this.updateJob = async (req, res) => {
            try {
                const updatedJob = await this.jobService.updateJob(req.params.id, req.body);
                res.json(updatedJob);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        // getJobById = async (req: Request, res: Response) => {
        //   try {
        //     const job = await this.jobService.getJobById(req.params.id);
        //     if (!job) {
        //       return res.status(404).json({ message: "Job not found" });
        //     }
        //     res.json(job);
        //   } catch (error) {
        //     res.status(500).json({ error: (error as Error).message });
        //   }
        // };
        // getAllJobs = async (req: Request, res: Response) => {
        //   try {
        //     const { userId } = req.headers["x-user"]
        //       ? JSON.parse(req.headers["x-user"] as string)
        //       : null;
        //     const jobs = await this.jobService.getAllJobsForAdmin();
        //     res.json(jobs);
        //   } catch (error) {
        //     res.status(500).json({ error: (error as Error).message });
        //   }
        // };
        this.getAllJobs = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : { userId: null };
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const search = req.query.search || "";
                const { jobs, total } = await this.jobService.getAllJobsForAdmin(page, pageSize, search);
                res.json({ jobs, total });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getJob = async (req, res) => {
            try {
                const { id } = req.params;
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const jobDetails = await this.jobService.getJob(id, userId);
                res.json(jobDetails);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getAllJobsBrief = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const jobs = await this.jobService.getAllJobsBrief(userId);
                res.json(jobs);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        // applyJob = async (req: Request, res: Response) => {
        //   try {
        //     const { jobId } = req.body;
        //     const { userId } = req.headers["x-user"]
        //       ? JSON.parse(req.headers["x-user"] as string)
        //       : null;
        //     if (!jobId || !userId) {
        //       res.status(400).json({ message: "jobId and jobSeekerId are required" });
        //       return;
        //     }
        //     const application = await this.jobService.applyForJob(jobId, userId);
        //     const job = await this.jobService.getJob(jobId, userId);
        //     const companyId = job.companyId;
        //     const companyDetails = await getCompaniesDetails([companyId]);
        //     await createConversation([userId, companyId], jobId, companyDetails[0].companyName, companyDetails[0].logo);
        //     if (application?.["Aptitude Test"]) {
        //       const interviewResponse = await createInterview(
        //         application.id,
        //         jobId,
        //         userId
        //       );
        //       if (
        //         //@ts-ignore
        //         !interviewResponse.interviewId || interviewResponse.status !== "pending"
        //       ) {
        //         res.status(400).json({ message: "Unable to Attend Aptitude Test" });
        //         return;
        //       }
        //       res.status(201).json({
        //         message: "Job application submitted, aptitude test scheduled",
        //         //@ts-ignore
        //         interviewId: interviewResponse.interviewId,
        //       });
        //       return;
        //     }
        //     res.status(201).json(application);
        //     return;
        //   } catch (error) {
        //     res.status(400).json({ message: (error as Error).message });
        //     return;
        //   }
        // };
        // getAllApplications = async (req: Request, res: Response) => {
        //   try {
        //     const { userId } = req.headers["x-user"]
        //       ? JSON.parse(req.headers["x-user"] as string)
        //       : null;
        //     const applications = await this.jobService.getAllApplications(userId);
        //     res.status(200).json({ success: true, data: applications });
        //     return;
        //   } catch (error) {
        //     console.log("Error fetching job applications:", error);
        //     res.status(500).json({ success: false, message: "Server error" });
        //     return;
        //   }
        // };
        // getApplicationStatus = async (req: Request, res: Response) => {
        //   try {
        //     const { userId } = req.headers["x-user"]
        //       ? JSON.parse(req.headers["x-user"] as string)
        //       : null;
        //     const jobId = req.params.id;
        //     console.log();
        //     const applications = await this.jobService.getApplicationsStatus(
        //       userId,
        //       jobId
        //     );
        //     res.status(200).json(applications);
        //     return;
        //   } catch (error) {
        //     console.log("Error fetching job applications:", error);
        //     res.status(500).json({ success: false, message: "Server error" });
        //     return;
        //   }
        // };
        // getFilteredJobs = async (req: Request, res: Response) => {
        //   try {
        //     const filters = {
        //       type: req.query.type as string | undefined,
        //       category: req.query.category as string | undefined,
        //       level: req.query.level as string | undefined,
        //       companyId: req.query.companyId as string | undefined,
        //     };
        //     const { userId } = req.headers["x-user"]
        //       ? JSON.parse(req.headers["x-user"] as string)
        //       : null;
        //     const jobs = await this.jobService.getFilteredJobs(filters, userId);
        //     res.json(jobs);
        //     return;
        //   } catch (error) {
        //     console.error("Error fetching jobs:", error);
        //     res.status(500).json({ message: "Internal Server Error" });
        //     return;
        //   }
        // };
        this.getFilteredJobs = async (req, res) => {
            try {
                const filters = req.query;
                const jobs = await this.jobService.fetchFilteredJobs(filters);
                res.json(jobs);
            }
            catch (error) {
                console.error("Error fetching jobs:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        };
        this.getCompanyJobs = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const companyId = await (0, grpcClient_1.getCompanyIdByUserId)(userId);
                if (!companyId) {
                    res.status(400).json({ error: "Company ID is required" });
                    return;
                }
                const jobs = await this.jobService.getCompanyJobs(companyId);
                res.json({ success: true, data: jobs });
            }
            catch (error) {
                console.error("Error fetching company jobs:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        };
        this.isJobExist = (call, callback) => {
            const { jobId } = call.request;
            this.jobService.isJobExist(jobId, callback);
        };
        this.fetchJobDetails = (call, callback) => {
            const { jobIds } = call.request;
            this.jobService.fetchJobDetails(jobIds, callback);
        };
        this.findJobIdsByCompanyId = async (call, callback) => {
            try {
                const { companyId } = call.request;
                if (!companyId) {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Company ID is required",
                    });
                    return;
                }
                const jobs = await this.jobService.getCompanyJobs(companyId);
                const jobIds = jobs.map(job => (job.id));
                console.log("@@ refracted for jobIds ", jobIds);
                callback(null, { jobIds: jobIds });
            }
            catch (error) {
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.message,
                });
            }
        };
        this.jobService = jobService;
    }
}
exports.default = JobController;
