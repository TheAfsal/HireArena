import { Request, Response } from "express";
import InvitationService from "../services/InvitationService";

class CompanyController {
  private invitationService: any;

  constructor(invitationService: InvitationService) {
    this.invitationService = invitationService;
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
    } catch (error) {
      //@ts-ignore
      console.log(error);

      res.status(500).json({
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
        res.status(400).json({
          status: "error",
          message: "Invalid input",
          error: "Authorization token is missing or malformed",
        });
        return;
      }

      const invitationDetails = await this.invitationService.invitationDetails(
        token
      );

      res.status(200).json({
        status: "success",
        message: "Invitation fetched successfully",
        data: invitationDetails,
      });
      return;
    } catch (error) {
      //@ts-ignore
      console.log(error);

      res.status(500).json({
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

      if (!token || !name || !password) {
        res.status(400).json({
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

      res.status(200).json({
        status: "success",
        message: "Invitation accepted successfully",
        data: user,
      });
      return;
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "An error occurred while accepting the invitation",
        error: (error as Error).message,
      });
      return;
    }
  };
}

export default CompanyController;
