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
const prismaClient_1 = __importDefault(require("./prismaClient"));
const CompanyRepository_1 = __importDefault(require("../repositories/CompanyRepository"));
const CompanyEmployeeRepository_1 = __importDefault(require("../repositories/CompanyEmployeeRepository"));
const EmployeeRepository_1 = __importDefault(require("../repositories/EmployeeRepository"));
const InvitationRepository_1 = __importDefault(require("../repositories/InvitationRepository"));
const JobSeekerRepository_1 = __importDefault(require("../repositories/JobSeekerRepository"));
const PasswordServices_1 = __importDefault(require("../services/PasswordServices"));
const TokenServices_1 = __importDefault(require("../services/TokenServices"));
const EmailServices_1 = __importDefault(require("../services/EmailServices"));
const RedisServices_1 = __importDefault(require("../services/RedisServices"));
const ProfileService_1 = __importDefault(require("../services/ProfileService"));
const InvitationService_1 = __importDefault(require("../services/InvitationService"));
const companyController_1 = __importDefault(require("../controllers/companyController"));
const CompanyServices_1 = __importDefault(require("../services/CompanyServices"));
const path_1 = __importDefault(require("path"));
const jobSeekerController_1 = __importDefault(require("../controllers/jobSeekerController"));
const PROTO_PATH = path_1.default.join(__dirname, "../proto/user-service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const server = new grpc.Server();
const companyRepository = new CompanyRepository_1.default(prismaClient_1.default);
const companyEmployeeRoleRepository = new CompanyEmployeeRepository_1.default(prismaClient_1.default);
const employeeRepository = new EmployeeRepository_1.default(prismaClient_1.default);
const invitationRepository = new InvitationRepository_1.default(prismaClient_1.default);
const jobSeekerRepository = new JobSeekerRepository_1.default(prismaClient_1.default);
const passwordService = new PasswordServices_1.default();
const tokenService = new TokenServices_1.default();
const emailService = new EmailServices_1.default();
const redisService = new RedisServices_1.default();
const companyService = new CompanyServices_1.default(companyEmployeeRoleRepository, companyRepository);
const profileService = new ProfileService_1.default(jobSeekerRepository, companyRepository, companyEmployeeRoleRepository, passwordService);
const invitationService = new InvitationService_1.default(invitationRepository, companyRepository, employeeRepository, companyEmployeeRoleRepository, tokenService, passwordService, emailService, redisService);
const companyController = new companyController_1.default(invitationService, profileService, companyService);
const jobSeekerController = new jobSeekerController_1.default(profileService);
//@ts-ignore
server.addService(userProto.UserService.service, {
    GetCompanyIdByUserId: companyController.getCompanyIdByUserId,
    GetAllJobSeekers: jobSeekerController.getAllJobSeekers,
    GetCompaniesDetails: companyController.getCompanyDetails,
});
exports.default = server;
