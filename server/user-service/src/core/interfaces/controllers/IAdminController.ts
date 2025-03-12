import { Request, Response } from "express";

export interface IAdminController {
  toggleCandidateStatus(req: Request, res: Response): Promise<void>;
  getAllCompanies(req: Request, res: Response): Promise<void>;
  verifyCompanyProfile(req: Request, res: Response): Promise<void>;
  getAllSubscriptions(req: Request, res: Response): Promise<void>;
}
