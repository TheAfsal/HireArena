import { Request, Response } from "express";
import { IUser } from "../core/types/IUser";
import {
  createConversation,
  getCompaniesDetails,
  getCompanyIdByUserId,
} from "@config/grpcClient";
import { IJobController } from "@core/interfaces/controllers/IJobController";
import { IJobService } from "@core/interfaces/services/IJobService";
import * as grpc from "@grpc/grpc-js";
import { IJob } from "@shared/types/job.types";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      requestId?:string
    }
  }
}

class JobController implements IJobController {
  private jobService: IJobService;

  constructor(jobService: IJobService) {
    this.jobService = jobService;
  }

  createJob = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const job = await this.jobService.createJob(req.body, userId);

      res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: (error as Error).message });
    }
  };

  updateJob = async (req: Request, res: Response) => {
    try {
      const updatedJob = await this.jobService.updateJob(req.params.id, req.body);
      res.json(updatedJob);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }


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

  getAllJobs = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : { userId: null };
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = (req.query.search as string) || "";

      const { jobs, total } = await this.jobService.getAllJobsForAdmin(page, pageSize, search);
      res.json({ jobs, total });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getJob = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const jobDetails = await this.jobService.getJob(id, userId);
      

      res.json(jobDetails);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getAllJobsBrief = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;
      const jobs = await this.jobService.getAllJobsBrief(userId);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
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

  getFilteredJobs = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const result = await this.jobService.fetchFilteredJobs(filters);
      res.json({
        success: true,
        data: result.jobs,
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: Math.ceil(result.total / result.pageSize)
        }
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
    // try {
    //   const filters = req.query;
    //   const jobs = await this.jobService.fetchFilteredJobs(filters);
    //   res.json(jobs);
    // } catch (error) {
    //   console.error("Error fetching jobs:", error);
    //   res.status(500).json({ message: "Internal Server Error" });
    // }
  };

  getCompanyJobs = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const companyId = await getCompanyIdByUserId(userId);

      if (!companyId) {
        res.status(400).json({ error: "Company ID is required" });
        return;
      }

      const jobs = await this.jobService.getCompanyJobs(companyId);
      res.json({ success: true, data: jobs });
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  isJobExist = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const { jobId } = call.request;
    this.jobService.isJobExist(jobId, callback);
  };

  fetchJobDetails = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const { jobIds } = call.request;
    this.jobService.fetchJobDetails(jobIds, callback);
  };

  findJobIdsByCompanyId = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<{jobIds:string[]}>
  ) => {
    try {
      const { companyId } = call.request;

      if (!companyId) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Company ID is required",
        });
        return;
      }

      const jobs: IJob[] = await this.jobService.getCompanyJobs(companyId);
      const jobIds = jobs.map(job => (job.id));

      console.log("@@ refracted for jobIds ", jobIds);
      
      
      callback(null, { jobIds:jobIds });      
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: (error as Error).message,
      });
    }
  };
}

export default JobController;
