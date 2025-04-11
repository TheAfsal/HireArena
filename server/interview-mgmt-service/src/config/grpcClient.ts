import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../proto/interview.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const interviewProto = grpc.loadPackageDefinition(packageDefinition).interview;

//@ts-ignore
const interviewServiceClient = new interviewProto.InterviewService(
  `${process.env.JOB_SERVER_URL}`,
  grpc.credentials.createInsecure()
);

const IsJobExist = (jobId:string) => {
  return new Promise<any>((resolve, reject) => {
    interviewServiceClient.IsJobExist({jobId}, (error: any, response: any) => {
      if (error) {
        console.log("@@ error on grpc job exist");
        
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export { IsJobExist };



// import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// import path from "path";

// const PROTO_PATH = path.join(__dirname, "../proto/user-service.proto");

// const packageDefinition = protoLoader.loadSync(PROTO_PATH);
// const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// //@ts-ignore
// const userServiceClient = new userProto.UserService(
//   `${process.env.USER_SERVER_URL}:5051`,
//   grpc.credentials.createInsecure()
// );

// const GetAllJobSeekers = () => {
//   return new Promise<any>((resolve, reject) => {
//     userServiceClient.GetAllJobSeekers({}, (error: any, response: any) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(response);
//       }
//     });
//   });
// };

// export { GetAllJobSeekers };
