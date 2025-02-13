import { Router } from "express";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import prisma from "../config/prismaClient";
import AdminController from "../controllers/adminController";
import JobSeekerService from "../services/JobSeekerService";
import CompanyService from "../services/CompanyServices";
import CompanyEmployeeRoleRepository from "../repositories/CompanyEmployeeRepository";
import RedisService from "../services/RedisServices";
import CompanyRepository from "../repositories/CompanyRepository";

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
  redisService,
  companyRepository
);

const adminController = new AdminController(companyService, jobSeekerService);

const router = Router();

router
  .route("/candidates")
  // .get(adminController.getAllCandidateProfile)
  .put(adminController.toggleCandidateStatus);

  router.route("/companies").get(adminController.getAllCompanies);
// .put(companyController.toggleStatus);

export default router;
