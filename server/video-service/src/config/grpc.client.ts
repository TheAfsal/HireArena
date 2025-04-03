// import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// import path from "path";

// const JOB_SERVER_PROTO_PATH = require.resolve("@workspace/proto/jobProto/job.proto");

// const jobServerPackageDefinition = protoLoader.loadSync(JOB_SERVER_PROTO_PATH);
// const jobProto: any = grpc.loadPackageDefinition(
//   jobServerPackageDefinition
// ).job;

// const jobServiceClient = new jobProto.UserService(
//   process.env.JOB_SERVER_URL,
//   grpc.credentials.createInsecure()
// );

// const getJobDetails = (jobId: string): Promise<JobDetails | null> => {
//   return new Promise((resolve, reject) => {
//     jobServiceClient.GetJobDetails(
//       { jobId },
//       (err: any, response: JobDetails) => {
//         if (err) {
//           console.error(`Error fetching job details for ${jobId}:`, err);
//           resolve(null);
//         } else {
//           resolve(response);
//         }
//       }
//     );
//   });
// };

// export { getJobDetails };

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


