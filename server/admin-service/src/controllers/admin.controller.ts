import { IAdminController } from "@core/interfaces/controllers/IAdminController";
import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";
import { TYPES } from "di/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";

@injectable()
class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.JobSeekerService) private jobSeekerService: IJobSeekerService
  ) {}

  getAllCandidates = async (req: Request, res: Response) => {
    try {
      const candidates = await this.jobSeekerService.getAllCandidates();
      res.status(StatusCodes.OK).json(candidates);
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
    }
  };
}

export default AdminController;
