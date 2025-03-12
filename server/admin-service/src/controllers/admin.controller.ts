import { IAdminController } from "@core/interfaces/controllers/IAdminController";
import { Request, Response } from "express";

class AdminController implements IAdminController{
  private jobSeekerService: any;

  constructor(jobSeekerService: any) {
    this.jobSeekerService = jobSeekerService;
  }

  getAllCandidates = async (req: Request, res: Response) => {
    try {
      const candidates = await this.jobSeekerService.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: (error as Error).message });
    }
  };
}

export default AdminController;
