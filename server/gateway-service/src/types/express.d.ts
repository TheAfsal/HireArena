import { IUser } from "./../types/IUser";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        fullName: string;
        email: string;
        password?: string;
        status?: boolean;
      };
      requestId?:string
    }
  }
}
