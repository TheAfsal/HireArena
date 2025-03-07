import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const USER_SERVER_PROTO_PATH = path.join(
  __dirname,
  "../proto/user-service.proto"
);
const INTERVIEW_SERVER_PROTO_PATH = path.resolve(
  __dirname,
  "../proto/interview.proto"
);

const userServerPackageDefinition = protoLoader.loadSync(
  USER_SERVER_PROTO_PATH
);
const userProto = grpc.loadPackageDefinition(userServerPackageDefinition).user;

const interviewServerPackageDefinition = protoLoader.loadSync(
  INTERVIEW_SERVER_PROTO_PATH
);
const interviewProto: any = grpc.loadPackageDefinition(
  interviewServerPackageDefinition
).interview;

//@ts-ignore
const userServiceClient = new userProto.UserService(
  `${process.env.USER_SERVER_URL}:5051`,
  grpc.credentials.createInsecure()
);

const interviewServerClient = new interviewProto.InterviewService(
  `${process.env.INTERVIEW_SERVER_URL}:${process.env.INTERVIEW_SERVER_GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

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

const getCompaniesDetails = (companyIds: string[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    userServiceClient.GetCompaniesDetails(
      { companyIds },
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.companies);
        }
      }
    );
  });
};

const createInterview = (
  applicationId: string,
  jobId: string,
  jobSeekerId: string
) => {
  return new Promise((resolve, reject) => {
    interviewServerClient.CreateInterview(
      { applicationId, jobId, jobSeekerId },
      (err: any, response: any) => {
        if (err) {
          console.error("Error calling Interview Service:", err);
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
};

const createAptitudeTest = (
  jobId: string,
  companyId: string,
) => {
  return new Promise((resolve, reject) => {
    interviewServerClient.CreateAptitudeTest(
      { jobId, companyId},
      (err: any, response: any) => {
        if (err) {
          console.error("Error calling Interview Service:", err);
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
};

export { getCompanyIdByUserId, getCompaniesDetails, createInterview, createAptitudeTest };

