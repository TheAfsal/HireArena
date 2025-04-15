import { Request, Response } from "express";

export interface IInterviewController {
  applyJob(req: Request, res: Response): Promise<void>;
  getInterview(req: Request, res: Response): Promise<void>;
  submitVideoInterview (req: Request, res: Response):Promise<void>;
  // getAptitudeQuestions(req: Request, res: Response): Promise<void>;
  // fetchAppliedJobStatus(req: Request, res: Response): Promise<void>;
}
