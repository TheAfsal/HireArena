// src/interfaces/IJobController.ts
import { Request, Response } from "express";

export interface IJobController {
  createJob(req: Request, res: Response): Promise<void>;
  getJobById(req: Request, res: Response): Promise<void>;
  getAllJobs(req: Request, res: Response): Promise<void>;
  getJob(req: Request, res: Response): Promise<void>;
  getAllJobsBrief(req: Request, res: Response): Promise<void>;
  applyJob(req: Request, res: Response): Promise<void>;
  getAllApplications(req: Request, res: Response): Promise<void>;
  getApplicationStatus(req: Request, res: Response): Promise<void>;
  getFilteredJobs(req: Request, res: Response): Promise<void>;
  getCompanyJobs(req: Request, res: Response): Promise<void>;
}
