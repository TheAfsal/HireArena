import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const PROTO_PATH = path.join(__dirname, "../proto/interview.proto");
const USER_PROTO_PATH = path.join(__dirname, "../proto/user.proto");
const CHAT_SERVER_PROTO_PATH = path.resolve(__dirname, "../proto/chat.proto");
const NOTIFICATION_SERVER_PROTO_PATH = path.resolve(
  __dirname,
  "../proto/notification.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);
const chatServerPackageDefinition = protoLoader.loadSync(
  CHAT_SERVER_PROTO_PATH
);
const notificationServerPackageDefinition = protoLoader.loadSync(
  NOTIFICATION_SERVER_PROTO_PATH
);

const interviewProto = grpc.loadPackageDefinition(packageDefinition).interview;
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;
const chatProto = grpc.loadPackageDefinition(chatServerPackageDefinition).chat;
const notificationProto = grpc.loadPackageDefinition(
  notificationServerPackageDefinition
).notification;

//@ts-ignore
const interviewServiceClient = new interviewProto.InterviewService(
  `${process.env.JOB_SERVER_URL}`,
  grpc.credentials.createInsecure()
);
//@ts-ignore
const userServiceClient = new userProto.UserService(
  `${process.env.USER_SERVER_URL}`,
  grpc.credentials.createInsecure()
);
//@ts-ignore
const chatServiceClient = new chatProto.ChatService(
  process.env.CHAT_SERVER_URL,
  grpc.credentials.createInsecure()
);
//@ts-ignore
console.log("====================================");
console.log(process.env.CHAT_SERVER_URL);
console.log(process.env.NOTIFICATION_SERVER_URL);
console.log("====================================");
//@ts-ignore
const notificationServiceClient = new notificationProto.NotificationService(
  process.env.NOTIFICATION_SERVER_URL,
  grpc.credentials.createInsecure()
);

const IsJobExist = (jobId: string) => {
  return new Promise<any>((resolve, reject) => {
    interviewServiceClient.IsJobExist(
      { jobId },
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
};

const FindJobIdsByCompanyId = (companyId: string) => {
  return new Promise<any>((resolve, reject) => {
    interviewServiceClient.FindJobIdsByCompanyId(
      { companyId },
      (error: any, response: any) => {
        if (error) {
          console.log("@@ error on grpc job exist ", error);
          reject(error);
        } else {
          resolve(response.jobIds);
        }
      }
    );
  });
};

const FindJobsByIds = (jobIds: string[]) => {
  return new Promise<any>((resolve, reject) => {
    interviewServiceClient.FetchJobDetailsById(
      { jobIds },
      (error: any, response: any) => {
        if (error) {
          console.log("@@ error on grpc fetching jobs by ids ", error);
          reject(error);
        } else {
          resolve(response.jobs);
        }
      }
    );
  });
};

const GetCompaniesDetails = (companyIds: string[]) => {
  return new Promise<any>((resolve, reject) => {
    userServiceClient.GetCompaniesDetails(
      { companyIds },
      (error: any, response: any) => {
        if (error) {
          console.log("@@ error on grpc fetching jobs by ids ", error);
          reject(error);
        } else {
          console.log(response);

          resolve(response.companies);
        }
      }
    );
  });
};

const createConversation = (
  participants: string[],
  jobId: string,
  companyName: string,
  logo: string
) => {
  return new Promise((resolve, reject) => {
    chatServiceClient.CreateConversation(
      { participants, jobId, companyName, logo },
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

const GetJobSeekerDetailsById = (ids: string[]) => {
  return new Promise((resolve, reject) => {
    userServiceClient.GetJobSeekerDetailsById(
      { ids },
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
 
const CreateNotification = (data: {
  userId: string;
  message: string;
  type: string;
  relatedId: string;
}) => {
  return new Promise((resolve, reject) => {

    notificationServiceClient.CreateNotification(
      data,
      (err: any, response: any) => {
        if (err) {
          console.error("Error calling Notification Service:", err);
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
}; 
 
export {
  IsJobExist,
  FindJobIdsByCompanyId,
  FindJobsByIds,
  GetCompaniesDetails,
  createConversation,
  GetJobSeekerDetailsById,
  CreateNotification,
};

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
