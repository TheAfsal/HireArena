import { Request, Response } from "express";
import { IAuthResponse } from "@core/types/IAuthResponse";
import { IError } from "@core/types/IError";
import { IGenericResponse } from "@core/types/IGenericResponse";
import { IJobSeeker } from "@shared/types/user.types";

export interface IAuthController {
  signup(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  verifyToken(
    req: Request,
    res: Response<
      IGenericResponse<IJobSeeker | IError> & {
        accessToken?: string;
        role?: string;
      }
    >
  ): Promise<void>;
  signupCompany(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  login(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  loginCompany(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  loginAdmin(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  refresh(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  setRefreshForGoogle(
    req: Request,
    res: Response<IGenericResponse<IAuthResponse | IError>>
  ): Promise<void>;
  whoAmI(
    req: Request,
    res: Response<IGenericResponse<{ role: string } | IError>>
  ): Promise<void>;
  forgotPasswordUsingToken (
    req: Request,
    res: Response
  ):Promise<void>
}
