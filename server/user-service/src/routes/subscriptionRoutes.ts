import { Router } from "express";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import prisma from "../config/prismaClient";
import AdminController from "../controllers/adminController";
import JobSeekerService from "../services/JobSeekerService";
import CompanyService from "../services/CompanyServices";
import CompanyEmployeeRoleRepository from "../repositories/CompanyEmployeeRepository";
import RedisService from "../services/RedisServices";
import CompanyRepository from "../repositories/CompanyRepository";
import SubscriptionController from "../controllers/subscriptionController";
import SubscriptionService from "../services/SubscriptionService";
import SubscriptionRepository from "../repositories/SubscriptionRepository";

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
const jobSeekerRepository = new JobSeekerRepository(prisma);

const subscriptionService = new SubscriptionService(subscriptionRepository,jobSeekerRepository);

const subscriptionController = new SubscriptionController(subscriptionService);

const router = Router();

router.post("/", subscriptionController.createSubscription);

export default router;
