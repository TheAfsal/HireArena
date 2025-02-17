import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import prisma from "./prismaClient";
import CompanyRepository from "../repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "../repositories/CompanyEmployeeRepository";
import EmployeeRepository from "../repositories/EmployeeRepository";
import InvitationRepository from "../repositories/InvitationRepository";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import PasswordService from "../services/PasswordServices";
import TokenService from "../services/TokenServices";
import EmailService from "../services/EmailServices";
import RedisService from "../services/RedisServices";
import ProfileService from "../services/ProfileService";
import InvitationService from "../services/InvitationService";
import CompanyController from "../controllers/companyController";
import CompanyService from "../services/CompanyServices";
import path from "path";
import JobSeekerController from "../controllers/jobSeekerController";

const PROTO_PATH = path.join(__dirname, "../proto/user-service.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const server = new grpc.Server();

const companyRepository = new CompanyRepository(prisma);
const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
const employeeRepository = new EmployeeRepository(prisma);
const invitationRepository = new InvitationRepository(prisma);
const jobSeekerRepository = new JobSeekerRepository(prisma);
const passwordService = new PasswordService();
const tokenService = new TokenService();
const emailService = new EmailService();
const redisService = new RedisService();
const companyService = new CompanyService(
  companyEmployeeRoleRepository,
  redisService,
  companyRepository
);
const profileService = new ProfileService(
  jobSeekerRepository,
  companyRepository,
  companyEmployeeRoleRepository,
  passwordService
);

const invitationService = new InvitationService(
  invitationRepository,
  companyRepository,
  employeeRepository,
  companyEmployeeRoleRepository,
  tokenService,
  passwordService,
  emailService,
  redisService
);

const companyController = new CompanyController(
  invitationService,
  profileService,
  companyService
);

const jobSeekerController = new JobSeekerController(profileService);

console.log(userProto);

//@ts-ignore
server.addService(userProto.UserService.service, {
  GetCompanyIdByUserId: companyController.getCompanyIdByUserId,
  GetAllJobSeekers: jobSeekerController.getAllJobSeekers,
  GetCompaniesDetails: companyController.getCompanyDetails,
});

export default server;
