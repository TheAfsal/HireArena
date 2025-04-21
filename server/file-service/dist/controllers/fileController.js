"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadFile(call, callback) {
        try {
            const { fileData, fileName, mimeType } = call.request;
            const fileBuffer = Buffer.from(fileData);
            const randomFileName = (0, crypto_1.randomBytes)(16).toString("hex");
            const fileExtension = fileName.split(".").pop();
            const newFileName = `${randomFileName}.${fileExtension}`;
            const fileUrl = await this.fileService.uploadFile(fileBuffer, newFileName, mimeType);
            callback(null, { fileUrl });
        }
        catch (error) {
            console.log(error);
            //@ts-ignore
            callback({ code: 500, message: error.message });
        }
    }
}
exports.default = FileController;
