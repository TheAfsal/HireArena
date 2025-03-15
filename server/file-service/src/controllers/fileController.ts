import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { IFileController } from "core/interfaces/controllers/IFileController";
import { IFileService } from "core/interfaces/services/IFileService";
import { randomBytes } from "crypto";

class FileController implements IFileController {
  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.fileService = fileService;
  }

  async uploadFile(
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ) {
    try {
      const { fileData, fileName, mimeType } = call.request;

      const fileBuffer = Buffer.from(fileData);

      const randomFileName = randomBytes(16).toString("hex");

      const fileExtension = fileName.split(".").pop();
      const newFileName = `${randomFileName}.${fileExtension}`;

      const fileUrl = await this.fileService.uploadFile(
        fileBuffer,
        newFileName,
        mimeType
      );

      callback(null, { fileUrl });
    } catch (error: any) {
      console.log(error);

      //@ts-ignore
      callback({ code: 500, message: error.message });
    }
  }
}

export default FileController;
