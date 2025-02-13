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

const GetAllJobSeekers = () => {
  
  return new Promise<any>((resolve, reject) => {
    userServiceClient.GetAllJobSeekers({ }, (error: any, response: any) => {
      console.log(response);
      
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export { GetAllJobSeekers };



