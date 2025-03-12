import { Request, Response } from "express";

export  interface IAdminController {
  getAllCandidates(req: Request, res: Response): Promise<void>;
}

