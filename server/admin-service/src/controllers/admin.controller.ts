import { IAdminController } from "@core/interfaces/controllers/IAdminController";
import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";
import { Request, Response } from "express";

class AdminController implements IAdminController{
  private jobSeekerService: IJobSeekerService;

  constructor(jobSeekerService: IJobSeekerService) {
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
