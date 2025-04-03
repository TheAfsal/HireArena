import { IUserCreateRequest } from "../../types/IUserCreateRequest";
import { IAuthResponse } from "../../types/IAuthResponse";
import { IEmployee, IJobSeeker } from "@shared/types/user.types";

export interface IAuthService {
  signup: (userData: IUserCreateRequest) => Promise<{ message: string }>;
  verifyToken: (token: string) => Promise<{
    user: IJobSeeker | IEmployee;
    accessToken: string;
    refreshToken?: string;
    role: string;
  } | null>;
  login: (email: string, password: string) => Promise<IAuthResponse>;
  signupCompany: (userData: IUserCreateRequest) => Promise<{ message: string }>;
  loginCompany: (email: string, password: string) => Promise<IAuthResponse>;
  loginAdmin: (email: string, password: string) => Promise<IAuthResponse>;
  refresh: (refreshToken: string) => Promise<IAuthResponse>;
  setRefreshForGoogle: (accessToken: string) => Promise<string>;
  whoAmI: (token: string) => Promise<{ role: string }>;
  googleLogin: (userData: {
    email: string;
    name: string;
    password: string;
  }) => Promise<Pick<IJobSeeker, "id" | "email" | "fullName"> | null>;
}
