import { Request, Response } from "express";

export interface IAptitudeTestController {
  submitTest(req: Request, res: Response): Promise<void>;
  getAptitudeResult(req: Request, res: Response): Promise<void>;
}