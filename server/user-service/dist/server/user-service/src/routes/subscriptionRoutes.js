"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const subscriptionController_1 = __importDefault(require("../controllers/subscriptionController"));
const SubscriptionService_1 = __importDefault(require("../services/SubscriptionService"));
const SubscriptionRepository_1 = __importDefault(require("../repositories/SubscriptionRepository"));
const TransactionService_1 = __importDefault(require("../services/TransactionService"));
const TransactionRepository_1 = __importDefault(require("../repositories/TransactionRepository"));
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
const transactionRepository = new TransactionRepository_1.default(prismaClient_1.default);
const subscriptionService = new SubscriptionService_1.default(subscriptionRepository);
const transactionService = new TransactionService_1.default(transactionRepository);
const subscriptionController = new subscriptionController_1.default(subscriptionService, transactionService);
const router = (0, express_1.Router)();
// router.post("/", subscriptionController.subscribe);
router.get("/", subscriptionController.subscriptionDetails);
router.post("/create-checkout-session", subscriptionController.createCheckoutSession);
router.post("/verify", subscriptionController.verifySubscription);
router.get("/user", subscriptionController.getSubscriptionHistory);
exports.default = router;
