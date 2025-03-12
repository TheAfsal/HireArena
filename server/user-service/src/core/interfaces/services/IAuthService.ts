import { IUserCreateRequest } from "../../types/IUserCreateRequest";
import { IAuthResponse } from "../../types/IAuthResponse";
import { IUser } from "../../types/IUser";
import { IJobSeeker } from "../../../interfaces/IJobSeeker";

export interface IAuthService {
  signup: (userData: IUserCreateRequest) => Promise<{ message: string }>;
  verifyToken: (token: string) => Promise<{
    user: IJobSeeker;
    accessToken: string;
    refreshToken?: string;
    role: string;
  } | null>;
  login: (email: string, password: string) => Promise<IAuthResponse>;
  signupCompany: (userData: IUserCreateRequest) => Promise<{ message: string }>;
  loginCompany: (email: string, password: string) => Promise<IAuthResponse>;
  loginAdmin: (email: string, password: string) => Promise<IAuthResponse>;
  refresh: (refreshToken: string) => Promise<IAuthResponse>;
  setRefreshForGoogle: (accessToken: string) => Promise<IAuthResponse>;
}
