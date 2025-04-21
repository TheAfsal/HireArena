"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = exports.createMachineTask = exports.createAptitudeTest = exports.getCompaniesDetails = exports.getCompanyIdByUserId = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const USER_SERVER_PROTO_PATH = path_1.default.join(__dirname, "../proto/user-service.proto");
const INTERVIEW_SERVER_PROTO_PATH = path_1.default.resolve(__dirname, "../proto/interview.proto");
const CHAT_SERVER_PROTO_PATH = path_1.default.resolve(__dirname, "../proto/chat.proto");
const userServerPackageDefinition = protoLoader.loadSync(USER_SERVER_PROTO_PATH);
const userProto = grpc.loadPackageDefinition(userServerPackageDefinition).user;
const interviewServerPackageDefinition = protoLoader.loadSync(INTERVIEW_SERVER_PROTO_PATH);
const interviewProto = grpc.loadPackageDefinition(interviewServerPackageDefinition).interview;
const chatServerPackageDefinition = protoLoader.loadSync(CHAT_SERVER_PROTO_PATH);
const chatProto = grpc.loadPackageDefinition(chatServerPackageDefinition).chat;
const userServiceClient = new userProto.UserService(process.env.USER_SERVER_URL, grpc.credentials.createInsecure());
const interviewServerClient = new interviewProto.InterviewService(process.env.INTERVIEW_SERVER_URL, grpc.credentials.createInsecure());
const chatServiceClient = new chatProto.ChatService(process.env.CHAT_SERVER_URL, grpc.credentials.createInsecure());
const getCompanyIdByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        userServiceClient.GetCompanyIdByUserId({ userId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response.companyId);
            }
        });
    });
};
exports.getCompanyIdByUserId = getCompanyIdByUserId;
const getCompaniesDetails = (companyIds) => {
    return new Promise((resolve, reject) => {
        userServiceClient.GetCompaniesDetails({ companyIds }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response.companies);
            }
        });
    });
};
exports.getCompaniesDetails = getCompaniesDetails;
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
const createAptitudeTest = (jobId, companyId) => {
    return new Promise((resolve, reject) => {
        interviewServerClient.CreateAptitudeTest({ jobId, companyId }, (err, response) => {
            if (err) {
                console.error("Error calling Interview Service:", err);
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.createAptitudeTest = createAptitudeTest;
const createMachineTask = (jobId, companyId) => {
    return new Promise((resolve, reject) => {
        interviewServerClient.CreateMachineTask({ jobId, companyId }, (err, response) => {
            if (err) {
                console.error("Error calling Interview Service:", err);
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.createMachineTask = createMachineTask;
const createConversation = (participants, jobId, companyName, logo) => {
    return new Promise((resolve, reject) => {
        chatServiceClient.CreateConversation({ participants, jobId, companyName, logo }, (err, response) => {
            if (err) {
                console.error("Error calling Chat Service:", err);
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.createConversation = createConversation;
