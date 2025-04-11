import { Request, Response } from "express";
import * as grpc from "@grpc/grpc-js";

export default interface IAptitudeController {
  CreateAptitudeTest(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  );
  submitTest(req: Request, res: Response): Promise<void>;
  // getAptitudeResult(req: Request, res: Response): Promise<void>;
}
