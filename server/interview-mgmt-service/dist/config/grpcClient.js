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
exports.createConversation = exports.GetCompaniesDetails = exports.FindJobsByIds = exports.FindJobIdsByCompanyId = exports.IsJobExist = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PROTO_PATH = path_1.default.join(__dirname, "../proto/interview.proto");
const USER_PROTO_PATH = path_1.default.join(__dirname, "../proto/user.proto");
const CHAT_SERVER_PROTO_PATH = path_1.default.resolve(__dirname, "../proto/chat.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);
const chatServerPackageDefinition = protoLoader.loadSync(CHAT_SERVER_PROTO_PATH);
const interviewProto = grpc.loadPackageDefinition(packageDefinition).interview;
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;
const chatProto = grpc.loadPackageDefinition(chatServerPackageDefinition).chat;
//@ts-ignore
const interviewServiceClient = new interviewProto.InterviewService(`${process.env.JOB_SERVER_URL}`, grpc.credentials.createInsecure());
//@ts-ignore
const userServiceClient = new userProto.UserService(`${process.env.USER_SERVER_URL}`, grpc.credentials.createInsecure());
//@ts-ignore
const chatServiceClient = new chatProto.ChatService(process.env.CHAT_SERVER_URL, grpc.credentials.createInsecure());
const IsJobExist = (jobId) => {
    return new Promise((resolve, reject) => {
        interviewServiceClient.IsJobExist({ jobId }, (error, response) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.IsJobExist = IsJobExist;
const FindJobIdsByCompanyId = (companyId) => {
    return new Promise((resolve, reject) => {
        interviewServiceClient.FindJobIdsByCompanyId({ companyId }, (error, response) => {
            if (error) {
                console.log("@@ error on grpc job exist ", error);
                reject(error);
            }
            else {
                resolve(response.jobIds);
            }
        });
    });
};
exports.FindJobIdsByCompanyId = FindJobIdsByCompanyId;
const FindJobsByIds = (jobIds) => {
    return new Promise((resolve, reject) => {
        interviewServiceClient.FetchJobDetailsById({ jobIds }, (error, response) => {
            if (error) {
                console.log("@@ error on grpc fetching jobs by ids ", error);
                reject(error);
            }
            else {
                resolve(response.jobs);
            }
        });
    });
};
exports.FindJobsByIds = FindJobsByIds;
const GetCompaniesDetails = (companyIds) => {
    return new Promise((resolve, reject) => {
        userServiceClient.GetCompaniesDetails({ companyIds }, (error, response) => {
            if (error) {
                console.log("@@ error on grpc fetching jobs by ids ", error);
                reject(error);
            }
            else {
                console.log(response);
                resolve(response.companies);
            }
        });
    });
};
exports.GetCompaniesDetails = GetCompaniesDetails;
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
