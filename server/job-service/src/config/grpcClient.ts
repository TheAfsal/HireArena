import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const USER_SERVER_PROTO_PATH = path.join(  __dirname,  "../proto/user-service.proto");
const INTERVIEW_SERVER_PROTO_PATH = path.resolve(  __dirname,  "../proto/interview.proto");
const CHAT_SERVER_PROTO_PATH = path.resolve(  __dirname,  "../proto/chat.proto");

const userServerPackageDefinition = protoLoader.loadSync( USER_SERVER_PROTO_PATH );
const userProto:any = grpc.loadPackageDefinition(userServerPackageDefinition).user;

const interviewServerPackageDefinition = protoLoader.loadSync( INTERVIEW_SERVER_PROTO_PATH );
const interviewProto:any = grpc.loadPackageDefinition( interviewServerPackageDefinition ).interview;

const chatServerPackageDefinition = protoLoader.loadSync( CHAT_SERVER_PROTO_PATH );
const chatProto:any = grpc.loadPackageDefinition(chatServerPackageDefinition).chat;


const userServiceClient = new userProto.UserService(process.env.USER_SERVER_URL,grpc.credentials.createInsecure());
const interviewServerClient = new interviewProto.InterviewService(process.env.INTERVIEW_SERVER_URL,grpc.credentials.createInsecure());
const chatServiceClient = new chatProto.ChatService(process.env.CHAT_SERVER_URL,grpc.credentials.createInsecure());


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

// const createInterview = (
//   applicationId: string,
//   jobId: string,
//   jobSeekerId: string
// ) => {
//   return new Promise((resolve, reject) => {
//     interviewServerClient.CreateInterview(
//       { applicationId, jobId, jobSeekerId },
//       (err: any, response: any) => {
//         if (err) {
//           console.error("Error calling Interview Service:", err);
//           reject(err);
//         } else {
//           resolve(response);
//         }
//       }
//     );
//   });
// };

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

const createMachineTask = (
  jobId: string,
  companyId: string,
) => {
  return new Promise((resolve, reject) => {
    interviewServerClient.CreateMachineTask(
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

const createConversation = (participants: string[], jobId: string ,companyName: string, logo:string) => {
  return new Promise((resolve, reject) => {
    chatServiceClient.CreateConversation(
      { participants, jobId , companyName, logo },
      (err: any, response: any) => {
        if (err) {
          console.error("Error calling Chat Service:", err);
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
};

export { getCompanyIdByUserId, getCompaniesDetails, createAptitudeTest,createMachineTask, createConversation };