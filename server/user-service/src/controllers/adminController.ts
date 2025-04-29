import { Request, Response } from "express";
import { IAdminController } from "@core/interfaces/controllers/IAdminController";
import { ICompanyService } from "@core/interfaces/services/ICompanyService";
import { IJobSeekerService } from "@core/interfaces/services/IJobSeekerService";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import { StatusCodes } from "http-status-codes";
class AdminController implements IAdminController {
  private companyService: ICompanyService;
  private jobSeekerService: IJobSeekerService;
  private subscriptionService: ISubscriptionService;

  constructor(
    companyService: ICompanyService,
    jobSeekerService: IJobSeekerService,
    subscriptionService: ISubscriptionService
  ) {
    this.companyService = companyService;
    this.jobSeekerService = jobSeekerService;
    this.subscriptionService = subscriptionService;
  }

  toggleCandidateStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.body;
      const updatedCandidate = await this.jobSeekerService.toggleStatus(userId);

      res.status(StatusCodes.OK).json(updatedCandidate);
      return;
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  getAllCompanies = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = (req.query.search as string) || "";

      const skip = (page - 1) * pageSize;

      const companies = await this.companyService.getAllCompanies(
        skip,
        pageSize,
        search
      );
      const total = await this.companyService.getCompaniesCount(search);

      res.status(StatusCodes.OK).json({
        companies,
        total,
        page,
        pageSize,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  // getAllCompanies = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const companies = await this.companyService.getAllCompanies();

  //     res.status(StatusCodes.OK).json(companies);
  //     return;
  //   } catch (error) {
  //     console.log(error);
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
  //     return;
  //   }
  // };

  verifyCompanyProfile = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const { status, rejectReason } = req.body;

      if (status !== "Approved" && status !== "Rejected") {
        res.status(StatusCodes.BAD_REQUEST).json({
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error verifying profile",
        error: (error as Error).message,
      });
    }
  };

  getAllSubscriptions = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 5;
      const skip = (page - 1) * pageSize;

      const { subscriptions, total } =
        await this.subscriptionService.getAllSubscriptions(skip, pageSize);

      res.status(StatusCodes.OK).json({ success: true, data: { subscriptions, total } });
      return;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }
  };

  // getAllSubscriptions = async (req: Request, res: Response) => {
  //   try {
  //     const subscriptions =
  //       await this.subscriptionService.getAllSubscriptions();
  //     res.status(StatusCodes.OK).json({ success: true, data: subscriptions });
  //     return;
  //   } catch (error) {
  //     console.error("Error fetching subscriptions:", error);
  //     res
  //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({ success: false, message: "Internal Server Error" });
  //     return;
  //   }
  // };
}

export default AdminController;
