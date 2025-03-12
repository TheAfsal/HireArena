import * as grpc from "@grpc/grpc-js";
import { Request, Response } from "express";
import { IError } from "core/types/IError";

export interface ICompanyController {
  sendInvitation(req: Request, res: Response<unknown | IError>): Promise<void>;
  invitationDetails(
    req: Request,
    res: Response<unknown | IError>
  ): Promise<void>;
  acceptInvitation(
    req: Request,
    res: Response<unknown | IError>
  ): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  fetchMediaLinks(req: Request, res: Response): Promise<void>;
  updateMediaLinks(req: Request, res: Response): Promise<void>;
  getCompanyIdByUserId(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ): void;
  getAllCompanies(req: Request, res: Response): Promise<void>;
  getCompanyDetails(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ): void;
}
