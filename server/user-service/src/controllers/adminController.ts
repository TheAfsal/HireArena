import { Request, Response } from "express";
import JobSeekerService from "../services/JobSeekerService";

class AdminController {
  private jobSeekerService: any;

  constructor(
    jobSeekerService: JobSeekerService,
  ) {
    this.jobSeekerService = jobSeekerService;
  }

  getAllCandidateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
    //   const { userId } = req.headers["x-user"]
    //     ? JSON.parse(req.headers["x-user"] as string)
    //     : null;

    //   const updatedMediaLinks = await this.profileService.updateMediaLinks(
    //     userId,
    //     req.body
    //   );

    //   res.status(200).json(updatedMediaLinks);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };
}

export default AdminController;
