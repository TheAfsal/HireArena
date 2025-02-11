import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

class FileRepository {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    console.log("reaching repository", fileName, mimeType);
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
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

export default FileRepository;
