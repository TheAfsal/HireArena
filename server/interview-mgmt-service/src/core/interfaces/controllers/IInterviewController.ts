import { Request, Response } from "express";

export interface IInterviewController {
  getAptitudeQuestions(req: Request, res: Response): Promise<void>;
  fetchAppliedJobStatus(req: Request, res: Response): Promise<void>;
}