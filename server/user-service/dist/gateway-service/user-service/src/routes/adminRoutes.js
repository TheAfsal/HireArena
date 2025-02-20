"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JobSeekerRepository_1 = __importDefault(require("../repositories/JobSeekerRepository"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const JobSeekerService_1 = __importDefault(require("../services/JobSeekerService"));
const CompanyServices_1 = __importDefault(require("../services/CompanyServices"));
const CompanyEmployeeRepository_1 = __importDefault(require("../repositories/CompanyEmployeeRepository"));
const RedisServices_1 = __importDefault(require("../services/RedisServices"));
const CompanyRepository_1 = __importDefault(require("../repositories/CompanyRepository"));
const jobSeekerRepository = new JobSeekerRepository_1.default(prismaClient_1.default);
const companyRepository = new CompanyRepository_1.default(prismaClient_1.default);
const companyEmployeeRoleRepository = new CompanyEmployeeRepository_1.default(prismaClient_1.default);
const redisService = new RedisServices_1.default();
const jobSeekerService = new JobSeekerService_1.default(jobSeekerRepository, redisService);
const companyService = new CompanyServices_1.default(companyEmployeeRoleRepository, redisService, companyRepository);
const adminController = new adminController_1.default(companyService, jobSeekerService);
const router = (0, express_1.Router)();
router
    .route("/candidates")
    // .get(adminController.getAllCandidateProfile)
    .put(adminController.toggleCandidateStatus);
router.route("/companies").get(adminController.getAllCompanies);
// .put(companyController.toggleStatus);
exports.default = router;
