"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyController {
    constructor(invitationService, profileService, companyService) {
        this.sendInvitation = async (req, 
        //@ts-ignore
        res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const { email, role, message } = req.body;
                console.log(email, role, message);
                console.log(userId);
                if (!email || !userId || !role) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid input",
                        error: "Email, companyId, and role are required.",
                    });
                    return;
                }
                await this.invitationService.sendInvitation(email, userId, role, message);
                res.status(200).json({
                    status: "success",
                    message: "Invitation sent successfully",
                });
                return;
            }
            catch (error) {
                //@ts-ignore
                console.log(error);
                res.status(500).json({
                    status: "error",
                    message: "An error occurred while sending the invitation",
                    error: error.message,
                });
                return;
            }
        };
        this.invitationDetails = async (req, 
        //@ts-ignore
        res) => {
            try {
                const { token } = req.params;
                if (!token) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid input",
                        error: "Authorization token is missing or malformed",
                    });
                    return;
                }
                const invitationDetails = await this.invitationService.invitationDetails(token);
                console.log(invitationDetails);
                res.status(200).json({
                    status: "success",
                    message: "Invitation fetched successfully",
                    data: invitationDetails,
                });
                return;
            }
            catch (error) {
                //@ts-ignore
                console.log(error);
                res.status(500).json({
                    status: "error",
                    message: "An error occurred while sending the invitation",
                    error: error.message,
                });
                return;
            }
        };
        this.acceptInvitation = async (req, 
        //@ts-ignore
        res) => {
            try {
                const { token, name, password } = req.body;
                console.log(token, name, password);
                if (!token || !name || !password) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid input",
                        error: "Token, name and password are required.",
                    });
                    return;
                }
                const user = await this.invitationService.acceptInvitation(token, name, password);
                res.cookie("refreshToken", user.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "development",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    status: "success",
                    message: "Invitation accepted successfully",
                    data: user,
                });
                return;
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "An error occurred while accepting the invitation",
                    error: error.message,
                });
                return;
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const companyProfile = await this.profileService.fetchCompanyProfile(userId);
                if (!companyProfile) {
                    res.status(404).json({ message: "Company not found" });
                    return;
                }
                res.status(200).json(companyProfile);
                return;
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
                return;
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                const { companyName, website, location, employeeCount, industry, foundingDay, foundingMonth, foundingYear, aboutCompany, jobCategories, } = req.body;
                const files = req.files;
                let logo;
                if (files[0]) {
                    logo = files[0];
                }
                else {
                    logo = req.body.logo;
                }
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const updatedCompany = await this.profileService.updateProfileCompany({
                    companyId: userId,
                    companyName,
                    website,
                    location,
                    employeeCount,
                    industry,
                    foundingDay,
                    foundingMonth,
                    foundingYear,
                    aboutCompany,
                    jobCategories,
                    logo,
                });
                res.status(200).json(updatedCompany);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.fetchMediaLinks = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const CompanyDetails = await this.profileService.medialLinks(userId);
                res.status(200).json(CompanyDetails);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.updateMediaLinks = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const updatedMediaLinks = await this.profileService.updateMediaLinks(userId, req.body);
                res.status(200).json(updatedMediaLinks);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.getEmployeesByCompany = async (req, res) => {
            try {
                const { companyId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const employees = await this.companyService.getEmployeesByCompanyId(companyId);
                console.log("@@employees: ", employees);
                res.status(200).json(employees);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error instanceof Error ? error.message : "Internal server error",
                });
            }
        };
        this.getCompanyIdByUserId = (call, callback) => {
            const { userId } = call.request;
            this.companyService.getCompanyIdByUserId(userId, callback);
        };
        this.getAllCompanies = async (req, res) => {
            try {
                const CompaniesDetails = await this.companyService.getAllCompanies();
                res.status(200).json(CompaniesDetails);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.getCompanyDetails = (call, callback) => {
            const { companyIds } = call.request;
            this.companyService.getCompanyDetailsById(companyIds, callback);
        };
        this.invitationService = invitationService;
        this.profileService = profileService;
        this.companyService = companyService;
    }
}
exports.default = CompanyController;
