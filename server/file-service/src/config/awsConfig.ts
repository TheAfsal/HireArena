import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

console.log();
console.log(process.env.AWS_ACCESS_KEY);
console.log(process.env.AWS_SECRET_KEY);
console.log(process.env.AWS_REGION);
console.log();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export default s3;
