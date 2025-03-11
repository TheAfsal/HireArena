import { Router } from "express";
import prisma from "@config/prismaClient";
import SubscriptionController from "@controllers/subscriptionController";
import SubscriptionService from "@services/SubscriptionService";
import SubscriptionRepository from "@repositories/SubscriptionRepository";
import TransactionService from "@services/TransactionService";
import TransactionRepository from "@repositories/TransactionRepository";

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

const subscriptionRepository = new SubscriptionRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

const subscriptionService = new SubscriptionService(subscriptionRepository);
const transactionService = new TransactionService(transactionRepository);

const subscriptionController = new SubscriptionController(
  subscriptionService,
  transactionService
);

const router = Router();

// router.post("/", subscriptionController.subscribe);
router.get("/", subscriptionController.subscriptionDetails);
router.post(
  "/create-checkout-session",
  subscriptionController.createCheckoutSession
);

router.post("/verify", subscriptionController.verifySubscription);

router.get("/user", subscriptionController.getSubscriptionHistory);

export default router;
