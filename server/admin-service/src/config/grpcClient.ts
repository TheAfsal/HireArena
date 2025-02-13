import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../proto/user-service.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

//@ts-ignore
const userServiceClient = new userProto.UserService(
  "localhost:5051",
  grpc.credentials.createInsecure()
);

const getCompanyIdByUserId = (userId: string) => {
  return new Promise<string>((resolve, reject) => {
    userServiceClient.GetCompanyIdByUserId({ userId }, (error: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.companyId);
      }
    });
  });
};

export { getCompanyIdByUserId };



