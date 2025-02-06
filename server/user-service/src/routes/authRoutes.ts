// user-service/routes/authRoutes.ts

import { Router } from "express";
import AuthService from "../services/AuthService";
import AuthController from "../controllers/authController";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import prisma from "../config/prismaClient";
import RedisService from "../services/RedisServices";
import PasswordService from "../services/PasswordServices";
import TokenService from "../services/TokenServices";
import EmailService from "../services/EmailServices";
import CompanyRepository from "../repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "../repositories/CompanyEmployeeRepository";
import EmployeeRepository from "../repositories/EmployeeRepository";
import InvitationService from "../services/InvitationService";
import CompanyController from "../controllers/companyController";
import InvitationRepository from "../repositories/InvitationRepository";

const userRepository = new JobSeekerRepository(prisma);
const companyRepository = new CompanyRepository(prisma);
const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
const employeeRepository = new EmployeeRepository(prisma);
const redisService = new RedisService();
const passwordService = new PasswordService();
const tokenService = new TokenService();
const emailService = new EmailService();
const invitationRepository = new InvitationRepository(prisma);

const authService = new AuthService(
  userRepository,
  companyRepository,
  employeeRepository,
  companyEmployeeRoleRepository,
  redisService,
  emailService,
  passwordService,
  tokenService
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

const companyController = new CompanyController(invitationService);

const authController = new AuthController(authService);

const router = Router();

router.post("/signup", authController.signup);
router.post("/verify-email/:token", authController.verifyToken);
router.post("/login", authController.login);
router.post("/company-signup", authController.signupCompany);
router.post("/company-login", authController.loginCompany);
router.get("/invite/:token", companyController.invitationDetails);
router.post("/company/invite", companyController.sendInvitation);
router.post("/company/accept-invite", companyController.acceptInvitation);
// router.post("/refresh-token", authController.refresh);

export default router;
