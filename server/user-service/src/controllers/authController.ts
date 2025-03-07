import { IGenericResponse } from "../types/IGenericResponse";
import { IError } from "../types/IError";
import { Request, Response } from "express";
import { IAuthService } from "../interfaces/IAuthService";
import { IAuthResponse } from "../types/IAuthResponse";
import { IUserCreateRequest } from "../types/IUserCreateRequest";
import { IJobSeeker } from "../interfaces/IJobSeeker";
import { IUser } from "../types/IUser";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  signup = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void> => {
    try {
      const userData: IUserCreateRequest = req.body;

      if (!userData.name || userData.name.trim().length < 3) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Name must be at least 3 characters long",
        });
        return;
      }
      if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      // Validate password (e.g., minimum length 6 characters)
      if (!userData.password || userData.password.length < 6) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      await this.authService.signup(userData);

      res.status(201).json({
        status: "success",
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "An error occurred during registration",
        error: (error as Error).message,
      });
    }
  };

  verifyToken = async (
    req: Request,
    res: Response<
      IGenericResponse<IJobSeeker | IError> & {
        accessToken?: string;
        role?: string;
      }
    >
  ): Promise<void> => {
    const { token } = req.params;

    try {
      const details = await this.authService.verifyToken(token);

      res.cookie("refreshToken", details?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: "success",
        message: "User verified successfully",
        data: details?.user,
        accessToken: details?.refreshToken ? details?.accessToken : "null",
        role: details?.role,
      });

      return;
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
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
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Name must be at least 3 characters long",
        });
        return;
      }
      if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      if (!userData.password || userData.password.length < 6) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Password must be at least 6 characters",
        });
        return;
      }

      await this.authService.signupCompany(userData);

      res.status(201).json({
        status: "success",
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (error) {
      res.status(500).json({
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
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      // Validate password (e.g., minimum length 6 characters)
      if (!password || password.length < 6) {
        res.status(400).json({
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

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          tokens: { accessToken: authResponse.tokens.accessToken },
          user: authResponse.user,
        },
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

  loginCompany = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      if (!password || password.length < 6) {
        res.status(400).json({
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

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          tokens: { accessToken: authResponse.tokens.accessToken },
          user: authResponse.user,
        },
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

  loginAdmin = async (
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        res.status(400).json({
          status: "error",
          message: "An error occurred during login",
          error: "Invalid email address",
        });
        return;
      }

      if (!password || password.length < 6) {
        res.status(400).json({
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

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          tokens: { accessToken: authResponse.tokens.accessToken },
          user: authResponse.user,
        },
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

      res.status(200).json({
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

      res.status(200).json({
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

  whoAmI = async (
    req: Request,
    res: Response<IGenericResponse<{ role: string } | IError>>
  ) => {
    try {
      const { token } = req.body;
      if (!token) {
        res
          .status(401)
          .json({ status: "error", message: "Identification failed" });
        return;
      }

      // const authResponse = await this.authService.whoAmI(refreshToken);

      res.status(200).json({
        status: "success",
        message: "user verified successfully",
        // role:authResponse.role,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "An error occurred during identification",
        error: (error as Error).message,
      });
    }
  };
}

export default AuthController;
