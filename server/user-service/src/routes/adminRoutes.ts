import { Router } from "express";
import JobSeekerRepository from "@repositories/JobSeekerRepository";
import prisma from "@config/prismaClient";
import AdminController from "@controllers/adminController";
import JobSeekerService from "@services/JobSeekerService";
import CompanyService from "@services/CompanyServices";
import CompanyEmployeeRoleRepository from "@repositories/CompanyEmployeeRepository";
import RedisService from "@services/RedisServices";
import CompanyRepository from "@repositories/CompanyRepository";
import SubscriptionService from "@services/SubscriptionService";
import SubscriptionRepository from "@repositories/SubscriptionRepository";

const jobSeekerRepository = new JobSeekerRepository(prisma);
const companyRepository = new CompanyRepository(prisma);
const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
const redisService = new RedisService();
const jobSeekerService = new JobSeekerService(
  jobSeekerRepository,
  redisService
);
const companyService = new CompanyService(
  companyEmployeeRoleRepository,
  companyRepository
);

const subscriptionRepository = new SubscriptionRepository(prisma);

const subscriptionService = new SubscriptionService(subscriptionRepository);

const adminController = new AdminController(
  companyService,
  jobSeekerService,
  subscriptionService
);

const router = Router();

router.route("/candidates").put(adminController.toggleCandidateStatus);

router.route("/companies").get(adminController.getAllCompanies);

router.put("/verify/:companyId", adminController.verifyCompanyProfile);

router.get("/subscriptions", adminController.getAllSubscriptions);

export default router;
