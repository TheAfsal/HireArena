import { IAdmin, IEmployee } from "@shared/types/user.types";
import { IUser } from "./IUser";

export interface IAuthResponse {
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
  user?: IUser | IAdmin | IEmployee;
}
