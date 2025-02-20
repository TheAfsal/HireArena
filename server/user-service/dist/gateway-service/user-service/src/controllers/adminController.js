"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminController {
    constructor(companyService, jobSeekerService) {
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
                const companies = await this.companyService.getAllCompanies();
                res.status(200).json(companies);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.companyService = companyService;
        this.jobSeekerService = jobSeekerService;
    }
}
exports.default = AdminController;
