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
console.log("asd");


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
      const jobs = await this.jobService.getAllJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}

export default JobController;
