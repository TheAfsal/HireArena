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
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const JobRepository_1 = __importDefault(require("../repositories/JobRepository"));
const JobApplicationRepository_1 = __importDefault(require("../repositories/JobApplicationRepository"));
const JobService_1 = __importDefault(require("../services/JobService"));
const jobController_1 = __importDefault(require("../controllers/jobController"));
dotenv_1.default.config();
const PROTO_PATH = path_1.default.resolve(__dirname, "../proto/interview.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const interviewProto = grpc.loadPackageDefinition(packageDefinition).interview;
const jobRepository = new JobRepository_1.default(prismaClient_1.default);
const jobApplicationRepository = new JobApplicationRepository_1.default(prismaClient_1.default);
const jobService = new JobService_1.default(jobRepository, jobApplicationRepository);
const jobController = new jobController_1.default(jobService);
const server = new grpc.Server();
//@ts-ignore
server.addService(interviewProto.InterviewService.service, {
    IsJobExist: jobController.isJobExist,
    FindJobIdsByCompanyId: jobController.findJobIdsByCompanyId,
    FetchJobDetailsById: jobController.fetchJobDetails
});
exports.default = server;
