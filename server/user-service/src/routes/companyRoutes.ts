// user-service/routes/authRoutes.ts

import { Router } from "express";
import prisma from "../config/prismaClient";
import PasswordService from "../services/PasswordServices";
import TokenService from "../services/TokenServices";
import CompanyRepository from "../repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "../repositories/CompanyEmployeeRepository";
import EmployeeRepository from "../repositories/EmployeeRepository";
import InvitationRepository from "../repositories/InvitationRepository";
import InvitationService from "../services/InvitationService";
import CompanyController from "../controllers/companyController";
import EmailService from "../services/EmailServices";
import RedisService from "../services/RedisServices";

const companyRepository = new CompanyRepository(prisma);
const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
const employeeRepository = new EmployeeRepository(prisma);
const invitationRepository = new InvitationRepository(prisma);
const passwordService = new PasswordService();
const tokenService = new TokenService();
const emailService = new EmailService();
const redisService = new RedisService();

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

const router = Router();

router.get("/invite/:token", companyController.invitationDetails);
router.post("/invite", companyController.sendInvitation);
router.post("/accept-invite", companyController.acceptInvitation);


export default router;
