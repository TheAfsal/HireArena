"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminController {
    constructor(companyService, jobSeekerService, subscriptionService) {
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
        this.toggleCandidateStatus = async (req, res) => {
            try {
                const { userId } = req.body;
                const updatedCandidate = await this.jobSeekerService.toggleStatus(userId);
                res.status(200).json(updatedCandidate);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.getAllCompanies = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const search = req.query.search || "";
                const skip = (page - 1) * pageSize;
                const companies = await this.companyService.getAllCompanies(skip, pageSize, search);
                const total = await this.companyService.getCompaniesCount(search);
                res.status(200).json({
                    companies,
                    total,
                    page,
                    pageSize,
                });
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        // getAllCompanies = async (req: Request, res: Response): Promise<void> => {
        //   try {
        //     const companies = await this.companyService.getAllCompanies();
        //     res.status(200).json(companies);
        //     return;
        //   } catch (error) {
        //     console.log(error);
        //     res.status(500).json({ message: (error as Error).message });
        //     return;
        //   }
        // };
        this.verifyCompanyProfile = async (req, res) => {
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
                const verifiedCompany = await this.companyService.verifyCompanyProfile(companyId, status, rejectReason);
                res.json({
                    message: `Company profile ${status.toLowerCase()}`,
                    data: verifiedCompany,
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Error verifying profile",
                    error: error.message,
                });
            }
        };
        this.getAllSubscriptions = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 5;
                const skip = (page - 1) * pageSize;
                const { subscriptions, total } = await this.subscriptionService.getAllSubscriptions(skip, pageSize);
                res.status(200).json({ success: true, data: { subscriptions, total } });
                return;
            }
            catch (error) {
                console.error("Error fetching subscriptions:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error" });
                return;
            }
        };
        this.companyService = companyService;
        this.jobSeekerService = jobSeekerService;
        this.subscriptionService = subscriptionService;
    }
}
exports.default = AdminController;
