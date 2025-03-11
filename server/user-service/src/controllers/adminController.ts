import { Request, Response } from "express";
import CompanyService from "@services/CompanyServices";
import JobSeekerService from "@services/JobSeekerService";
import SubscriptionService from "@services/SubscriptionService";

class AdminController {
  private companyService: any;
  private jobSeekerService: any;
  private subscriptionService: any;

  constructor(
    companyService: CompanyService,
    jobSeekerService: JobSeekerService,
    subscriptionService: SubscriptionService
  ) {
    this.companyService = companyService;
    this.jobSeekerService = jobSeekerService;
    this.subscriptionService = subscriptionService;
  }

  // getAllCandidateProfile = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //   //   const { userId } = req.headers["x-user"]
  //   //     ? JSON.parse(req.headers["x-user"] as string)
  //   //     : null;

  //   //   const updatedMediaLinks = await this.profileService.updateMediaLinks(
  //   //     userId,
  //   //     req.body
  //   //   );

  //   //   res.status(200).json(updatedMediaLinks);
  //     return;
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: (error as Error).message });
  //     return;
  //   }
  // };

  toggleCandidateStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const updatedCandidate = await this.jobSeekerService.toggleStatus(userId);

      res.status(200).json(updatedCandidate);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  getAllCompanies = async (req: Request, res: Response): Promise<void> => {
    try {
      const companies = await this.companyService.getAllCompanies();

      res.status(200).json(companies);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  verifyCompanyProfile = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const { status, rejectReason } = req.body;

      if (status !== "Approved" && status !== "Rejected") {
        res.status(400).json({
          message: "Invalid status. Must be 'Approved' or 'Rejected'.",
        });
        return;
      }

      console.log(companyId, status, rejectReason);

      const verifiedCompany = await this.companyService.verifyCompanyProfile(
        companyId,
        status,
        rejectReason
      );

      res.json({
        message: `Company profile ${status.toLowerCase()}`,
        data: verifiedCompany,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error verifying profile",
        error: (error as Error).message,
      });
    }
  };

  getAllSubscriptions = async (req: Request, res: Response) => {
    try {
      const subscriptions =
        await this.subscriptionService.getAllSubscriptions();
      res.status(200).json({ success: true, data: subscriptions });
      return;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }
  };
}

export default AdminController;
