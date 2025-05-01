import { Request, Response } from "express";
import * as grpc from "@grpc/grpc-js";

export interface INotificationController {
  createNotification(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ): void;
  getCandidateNotifications(req: Request, res: Response): void;
  markNotificationAsRead (req: Request, res: Response): void;
}
