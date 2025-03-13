import { Request, Response } from "express";
import { IUser } from "../core/types/IUser";
import { createInterview, getCompanyIdByUserId } from "@config/grpcClient";
import { IJobController } from "@core/interfaces/controllers/IJobController";
import { IJobService } from "@core/interfaces/services/IJobService";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

class JobController implements IJobController{
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

  getAllJobs = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;
      const jobs = await this.jobService.getAllJobs(userId);
      res.json(jobs);
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
      console.log(jobDetails);

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

  applyJob = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.body;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!jobId || !userId) {
        res.status(400).json({ message: "jobId and jobSeekerId are required" });
        return;
      }

      const application = await this.jobService.applyForJob(jobId, userId);

      if (application?.["Aptitude Test"]) {
        const interviewResponse = await createInterview(
          application.id,
          jobId,
          userId
        );

        if (
          //@ts-ignore
          !interviewResponse.interviewId || interviewResponse.status !== "pending"
        ) {
          res.status(400).json({ message: "Unable to Attend Aptitude Test" });
          return;
        }

        res.status(201).json({
          message: "Job application submitted, aptitude test scheduled",
          //@ts-ignore
          interviewId: interviewResponse.interviewId,
        });
        return;
      }

      res.status(201).json(application);
      return;
    } catch (error) {

      res.status(400).json({ message: (error as Error).message });
      return;
    }
  };

  getAllApplications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const applications = await this.jobService.getAllApplications(userId);

      res.status(200).json({ success: true, data: applications });
      return;
    } catch (error) {
      console.log("Error fetching job applications:", error);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  };

  getApplicationStatus = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const jobId = req.params.id;

      console.log();

      const applications = await this.jobService.getApplicationsStatus(
        userId,
        jobId
      );

      res.status(200).json(applications);
      return;
    } catch (error) {
      console.log("Error fetching job applications:", error);
      res.status(500).json({ success: false, message: "Server error" });
      return;
    }
  };

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

  //     console.log('====================================');
  //     console.log(jobs);
  //     console.log('====================================');

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
      const jobs = await this.jobService.fetchFilteredJobs(filters);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getCompanyJobs = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const companyId =await getCompanyIdByUserId(userId);

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
}

export default JobController;
