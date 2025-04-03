import { Request, Response } from "express";
import * as grpc from "@grpc/grpc-js";

export interface IJobSeekerController {
  updateProfile(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  getMinimalProfile(req: Request, res: Response): Promise<void>;
  getMiniProfileByCompany(req: Request, res: Response): Promise<void>;
  changePassword(req: Request, res: Response): Promise<void>;
  getAllJobSeekers(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ): void;
}
