import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const USER_SERVER_PROTO_PATH = path.join(  __dirname,  "../proto/user.proto");

const userServerPackageDefinition = protoLoader.loadSync( USER_SERVER_PROTO_PATH );
const userProto:any = grpc.loadPackageDefinition(userServerPackageDefinition).user;

const userServiceClient = new userProto.UserService(process.env.USER_SERVER_URL,grpc.credentials.createInsecure());

const getCompanyIdByUserId = (userId: string) => {
  return new Promise<string>((resolve, reject) => {
    userServiceClient.GetCompanyIdByUserId(
      { userId },
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.companyId);
        }
      }
    );
  });
};

export { getCompanyIdByUserId };


