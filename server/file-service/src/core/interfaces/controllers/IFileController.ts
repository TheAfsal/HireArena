import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";



export interface IFileController {
  uploadFile(
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ): Promise<void>;
}