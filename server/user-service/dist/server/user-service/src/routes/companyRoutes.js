"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const PasswordServices_1 = __importDefault(require("../services/PasswordServices"));
const TokenServices_1 = __importDefault(require("../services/TokenServices"));
const CompanyRepository_1 = __importDefault(require("../repositories/CompanyRepository"));
const CompanyEmployeeRepository_1 = __importDefault(require("../repositories/CompanyEmployeeRepository"));
const EmployeeRepository_1 = __importDefault(require("../repositories/EmployeeRepository"));
const InvitationRepository_1 = __importDefault(require("../repositories/InvitationRepository"));
const InvitationService_1 = __importDefault(require("../services/InvitationService"));
const companyController_1 = __importDefault(require("../controllers/companyController"));
const EmailServices_1 = __importDefault(require("../services/EmailServices"));
const RedisServices_1 = __importDefault(require("../services/RedisServices"));
const ProfileService_1 = __importDefault(require("../services/ProfileService"));
const JobSeekerRepository_1 = __importDefault(require("../repositories/JobSeekerRepository"));
const userProfileConfig_1 = __importDefault(require("../middlewares/userProfileConfig"));
const CompanyServices_1 = __importDefault(require("../services/CompanyServices"));
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
const router = (0, express_1.Router)();
router.get("/invite/:token", companyController.invitationDetails);
router.post("/invite", companyController.sendInvitation);
router.post("/accept-invite", companyController.acceptInvitation);
router.get("/profile", companyController.getProfile);
router.put("/profile", userProfileConfig_1.default.any(), companyController.updateProfile);
router.get("/media-links", companyController.fetchMediaLinks);
router.put("/media-links", companyController.updateMediaLinks);
router.get("/employees", companyController.getEmployeesByCompany);
exports.default = router;
