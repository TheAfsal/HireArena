import { Request, Response } from "express";
import { IUser } from "../types/IUser";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

class JobController {
  private jobService: any;

  constructor(jobService: any) {
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

  getJobById = async (req: Request, res: Response) => {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

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
      // const file = req.file;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!jobId || !userId) {
        res.status(400).json({ message: "jobId and jobSeekerId are required" });
        return;
      }

      // const resumeUrl = file ? `/uploads/${file.filename}` : undefined;

      console.log(jobId, userId);

      const application = await this.jobService.applyForJob(jobId, userId);

      res.status(201).json({
        message: "Job application submitted successfully",
        application,
      });
      return;
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
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

  getFilteredJobs = async (req: Request, res: Response) => {
    try {
      const filters = {
        type: req.query.type as string | undefined,
        category: req.query.category as string | undefined,
        level: req.query.level as string | undefined,
        companyId: req.query.companyId as string | undefined,
      };

      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const jobs = await this.jobService.getFilteredJobs(filters, userId);
      // console.log(jobs);

      res.json(jobs);
      return;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };
}

export default JobController;
