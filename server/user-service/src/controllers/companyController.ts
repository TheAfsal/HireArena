import { Request, Response } from "express";
import * as grpc from "@grpc/grpc-js";
import InvitationService from "@services/InvitationService";
import ProfileService from "@services/ProfileService";
import CompanyService from "@services/CompanyServices";
import { ICompanyController } from "@core/interfaces/controllers/ICompanyController";
import { StatusCodes } from "http-status-codes";
class CompanyController implements ICompanyController {
  private invitationService: any;
  private profileService: any;
  private companyService: any;

  constructor(
    invitationService: InvitationService,
    profileService: ProfileService,
    companyService: CompanyService
  ) {
    this.invitationService = invitationService;
    this.profileService = profileService;
    this.companyService = companyService;
  }

  sendInvitation = async (
    req: Request,
    //@ts-ignore
    res: Response<unknown | IError>
  ): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const { email, role, message } = req.body;

      console.log(email, role, message);
      console.log(userId);

      if (!email || !userId || !role) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "Invalid input",
          error: "Email, companyId, and role are required.",
        });
        return;
      }

      await this.invitationService.sendInvitation(email, userId, role, message);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Invitation sent successfully",
      });
      return;
    } catch (error) {
      //@ts-ignore
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred while sending the invitation",
        error: (error as Error).message,
      });
      return;
    }
  };

  invitationDetails = async (
    req: Request,
    //@ts-ignore
    res: Response<unknown | IError>
  ): Promise<void> => {
    try {
      const { token } = req.params;

      if (!token) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "Invalid input",
          error: "Authorization token is missing or malformed",
        });
        return;
      }

      const invitationDetails = await this.invitationService.invitationDetails(
        token
      );

      console.log(invitationDetails);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Invitation fetched successfully",
        data: invitationDetails,
      });
      return;
    } catch (error) {
      //@ts-ignore
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred while sending the invitation",
        error: (error as Error).message,
      });
      return;
    }
  };

  acceptInvitation = async (
    req: Request,
    //@ts-ignore
    res: Response<unknown | IError>
  ): Promise<void> => {
    try {
      const { token, name, password } = req.body;

      console.log(token, name, password);

      if (!token || !name || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "Invalid input",
          error: "Token, name and password are required.",
        });
        return;
      }

      const user = await this.invitationService.acceptInvitation(
        token,
        name,
        password
      );

      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Invitation accepted successfully",
        data: user,
      });
      return;
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred while accepting the invitation",
        error: (error as Error).message,
      });
      return;
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const companyProfile = await this.profileService.fetchCompanyProfile(
        userId
      );

      if (!companyProfile) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Company not found" });
        return;
      }

      res.status(StatusCodes.OK).json(companyProfile);
      return;
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      return;
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
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
      } = req.body;

      const files = req.files as Express.Multer.File[];
      let logo;

      if (files[0]) {
        logo = files[0];
      } else {
        logo = req.body.logo;
      }

      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
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

      res.status(StatusCodes.OK).json(updatedCompany);
      return;
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  fetchMediaLinks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const CompanyDetails = await this.profileService.medialLinks(userId);

      res.status(StatusCodes.OK).json(CompanyDetails);
      return;
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  updateMediaLinks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const updatedMediaLinks = await this.profileService.updateMediaLinks(
        userId,
        req.body
      );

      res.status(StatusCodes.OK).json(updatedMediaLinks);
      return;
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  getEmployeesByCompany = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { companyId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const employees = await this.companyService.getEmployeesByCompanyId(
        companyId
      );

      console.log("@@employees: ", employees);

      res.status(StatusCodes.OK).json(employees);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getCompanyIdByUserId = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const { userId } = call.request;

    this.companyService.getCompanyIdByUserId(userId, callback);
  };

  getAllCompanies = async (req: Request, res: Response): Promise<void> => {
    try {
      const CompaniesDetails = await this.companyService.getAllCompanies();

      res.status(StatusCodes.OK).json(CompaniesDetails);
      return;
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  getCompanyDetails = (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const { companyIds } = call.request;

    this.companyService.getCompanyDetailsById(companyIds, callback);
  };
}

export default CompanyController;
