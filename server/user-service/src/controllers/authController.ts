import { IGenericResponse } from "../core/types/IGenericResponse";
import { IError } from "../core/types/IError";
import { Request, Response } from "express";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { IAuthResponse } from "../core/types/IAuthResponse";
import { IUserCreateRequest } from "@core/types/IUserCreateRequest";
import { IUser } from "@core/types/IUser";
import { IAuthController } from "@core/interfaces/controllers/IAuthController";
import { IProfileService } from "@core/interfaces/services/IProfileService";
import { StatusCodes } from "http-status-codes";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      requestId?: string;
    }
  }
}

class AuthController implements IAuthController {
  constructor(
    private authService: IAuthService,
    private profileService: IProfileService
  ) {}

  signup = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void> => {
    try {
      const userData: IUserCreateRequest = req.body;

      if (!userData.name || userData.name.trim().length < 3) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Name must be at least 3 characters long",
        });
        return;
      }
      if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      // Validate password (e.g., minimum length 6 characters)
      if (!userData.password || userData.password.length < 6) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      await this.authService.signup(userData);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred during registration",
        error: (error as Error).message,
      });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
      const details = await this.authService.verifyToken(token);

      res.cookie("refreshToken", details?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "User verified successfully",
        data: details?.user,
        accessToken: details?.refreshToken ? details?.accessToken : "null",
        role: details?.role,
      });

      return;
    } catch (error: any) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred during registration",
        error: (error as Error).message,
      });
      return;
    }
  };

  signupCompany = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      const userData: IUserCreateRequest = req.body;

      if (!userData.name || userData.name.trim().length < 3) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Name must be at least 3 characters long",
        });
        return;
      }
      if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      if (!userData.password || userData.password.length < 6) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      await this.authService.signupCompany(userData);

      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred during registration",
        error: (error as Error).message,
      });
    }
  };

  login = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      // Validate password (e.g., minimum length 6 characters)
      if (!password || password.length < 6) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      const authResponse = await this.authService.login(email, password);

      res.cookie("refreshToken", authResponse.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          tokens: { accessToken: authResponse.tokens.accessToken },
          user: authResponse.user,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred during login",
        error: (error as Error).message,
      });
    }
  };

  loginCompany = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      if (!password || password.length < 6) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      const authResponse = await this.authService.loginCompany(email, password);

      res.cookie("refreshToken", authResponse.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          tokens: { accessToken: authResponse.tokens.accessToken },
          user: authResponse.user,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred during login",
        error: (error as Error).message,
      });
    }
  };

  loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      if (!password || password.length < 6) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      const authResponse = await this.authService.loginAdmin(email, password);

      res.cookie("refreshToken", authResponse.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          tokens: { accessToken: authResponse.tokens.accessToken },
          user: authResponse.user,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "An error occurred during login",
        error: (error as Error).message,
      });
    }
  };

  // sendInvitation = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const {email,role,message} = req.body;
  //     if (!email || !/\S+@\S+\.\S+/.test(email)) {
  //       res.status(400).json({
  //         status: "error",
  //         message: "An error occurred during login",
  //         error: "Invalid email address",
  //       });
  //       return;
  //     }

  //   } catch (error) {

  //   }
  // };

  refresh = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      console.log("req.cookies", req.cookies.refreshToken);

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res
          .status(401)
          .json({ status: "error", message: "Refresh token is missing" });
        return;
      }

      const authResponse = await this.authService.refresh(refreshToken);

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Tokens refreshed successfully",
        data: { tokens: authResponse.tokens },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "An error occurred during token refresh",
        error: (error as Error).message,
      });
    }
  };

  setRefreshForGoogle = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      console.log("-----", req.body);
      const { token } = req.body;

      const authResponse = await this.authService.setRefreshForGoogle(token);

      console.log("authResponse");

      console.log(authResponse);

      res.cookie("refreshToken", authResponse, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Tokens refreshed successfully",
        data: { tokens: token },
      });
      console.log("@@@@@@@@");
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "An error occurred during token refresh",
        error: (error as Error).message,
      });
    }
  };

  whoAmI = async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      let details;
      console.log(role);

      if (!role) {
        details = await this.profileService.getProfile(userId);
        console.log("@@ who am i: ", details);
        res.status(StatusCodes.OK).json({
          status: "success",
          message: "user verified successfully",
          role: "job-seeker",
          user: {
            fullName: details.fullName,
            email: details.email,
            image: details.image,
          },
        });
      } else {
        details = await this.profileService.fetchEmployeeProfile(userId);
        console.log("@@ who am i - : ", details);
        res.status(StatusCodes.OK).json({
          status: "success",
          message: "user verified successfully",
          role: details.role,
          user: {
            fullName: "details.name",
            email: "details.email",
            image: "",
          },
        });
      }

      if (!details) {
        res.status(500).json({
          status: "error",
          message: "User failed during identification",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "An error occurred during identification",
        error: (error as Error).message,
      });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log(email);

      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      await this.authService.forgotPassword(email);
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Email sent successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: "error",
        message: "An error occurred during login",
        error: (error as Error).message,
      });
    }
  };

  forgotPasswordUsingToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      await this.authService.forgotPasswordUsingToken(token, newPassword);
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        status: "error",
        message: "An error occurred during updation",
        error: (error as Error).message,
      });
    }
  };
}

export default AuthController;
