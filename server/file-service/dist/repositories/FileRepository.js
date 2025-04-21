"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class FileRepository {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });
    }
    async uploadFile(fileBuffer, fileName, mimeType) {
        console.log("reaching repository", fileName, mimeType);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${fileName}`,
            Body: fileBuffer,
            ContentType: mimeType,
            ACL: "public-read",
        };
        const result = await this.s3.upload(params).promise();
        console.log("file uploaded successfully", result);
        return result.Location;
    }
}
exports.default = FileRepository;
