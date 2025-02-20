"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobSeekerController_1 = __importDefault(require("../controllers/jobSeekerController"));
const userProfileConfig_1 = __importDefault(require("../middlewares/userProfileConfig"));
const ProfileService_1 = __importDefault(require("../services/ProfileService"));
const JobSeekerRepository_1 = __importDefault(require("../repositories/JobSeekerRepository"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const PasswordServices_1 = __importDefault(require("../services/PasswordServices"));
const CompanyRepository_1 = __importDefault(require("../repositories/CompanyRepository"));
const CompanyEmployeeRepository_1 = __importDefault(require("../repositories/CompanyEmployeeRepository"));
const jobSeekerRepository = new JobSeekerRepository_1.default(prismaClient_1.default);
const companyRepository = new CompanyRepository_1.default(prismaClient_1.default);
const companyEmployeeRoleRepository = new CompanyEmployeeRepository_1.default(prismaClient_1.default);
const passwordService = new PasswordServices_1.default();
const profileService = new ProfileService_1.default(jobSeekerRepository, companyRepository, companyEmployeeRoleRepository, passwordService);
const JobSeekerController = new jobSeekerController_1.default(profileService);
const router = (0, express_1.Router)();
router
    .route("/profile")
    .get(JobSeekerController.getProfile)
    .put(userProfileConfig_1.default.any(), JobSeekerController.updateProfile);
router.put("/change-password", JobSeekerController.changePassword);
router.get("/profile/minimal", JobSeekerController.getMinimalProfile);
exports.default = router;
