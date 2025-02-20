"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JobSeekerRepository_1 = __importDefault(require("../repositories/JobSeekerRepository"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const subscriptionController_1 = __importDefault(require("../controllers/subscriptionController"));
const SubscriptionService_1 = __importDefault(require("../services/SubscriptionService"));
const SubscriptionRepository_1 = __importDefault(require("../repositories/SubscriptionRepository"));
// const jobSeekerRepository = new JobSeekerRepository(prisma);
// const companyRepository = new CompanyRepository(prisma);
// const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
// const redisService = new RedisService();
// const jobSeekerService = new JobSeekerService(
//   jobSeekerRepository,
//   redisService
// );
// const companyService = new CompanyService(
//   companyEmployeeRoleRepository,
//   redisService,
//   companyRepository
// );
// const adminController = new AdminController(companyService, jobSeekerService);
const subscriptionRepository = new SubscriptionRepository_1.default(prismaClient_1.default);
const jobSeekerRepository = new JobSeekerRepository_1.default(prismaClient_1.default);
const subscriptionService = new SubscriptionService_1.default(subscriptionRepository, jobSeekerRepository);
const subscriptionController = new subscriptionController_1.default(subscriptionService);
const router = (0, express_1.Router)();
router.post("/", subscriptionController.createSubscription);
exports.default = router;
