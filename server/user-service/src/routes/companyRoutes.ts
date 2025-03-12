import { Router } from "express";
import prisma from "@config/prismaClient";
import PasswordService from "@services/PasswordServices";
import TokenService from "@services/TokenServices";
import CompanyRepository from "@repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "@repositories/CompanyEmployeeRepository";
import EmployeeRepository from "@repositories/EmployeeRepository";
import InvitationRepository from "@repositories/InvitationRepository";
import InvitationService from "@services/InvitationService";
import CompanyController from "@controllers/companyController";
import EmailService from "@services/EmailServices";
import RedisService from "@services/RedisServices";
import ProfileService from "@services/ProfileService";
import JobSeekerRepository from "@repositories/JobSeekerRepository";
import upload from "../middlewares/userProfileConfig";
import CompanyService from "@services/CompanyServices";

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

const router = Router();

router.get("/invite/:token", companyController.invitationDetails);
router.post("/invite", companyController.sendInvitation);
router.post("/accept-invite", companyController.acceptInvitation);

router.get("/profile", companyController.getProfile);
router.put("/profile", upload.any(), companyController.updateProfile);

router.get("/media-links", companyController.fetchMediaLinks);
router.put("/media-links", companyController.updateMediaLinks);

export default router;
