import { Router } from "express";
import jobSeekerController from "@controllers/jobSeekerController";
import upload from "../middlewares/userProfileConfig";
import ProfileService from "@services/ProfileService";
import JobSeekerRepository from "@repositories/JobSeekerRepository";
import prisma from "@config/prismaClient";
import PasswordService from "@services/PasswordServices";
import CompanyRepository from "@repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "@repositories/CompanyEmployeeRepository";

const jobSeekerRepository = new JobSeekerRepository(prisma);
const companyRepository = new CompanyRepository(prisma);
const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(prisma);
const passwordService = new PasswordService();
const profileService = new ProfileService(
  jobSeekerRepository,
  companyRepository,
  companyEmployeeRoleRepository,
  passwordService
);
const JobSeekerController = new jobSeekerController(profileService);

const router = Router();

router
  .route("/profile")
  .get(JobSeekerController.getProfile)
  .put(upload.any(), JobSeekerController.updateProfile);

router.put("/change-password", JobSeekerController.changePassword);
router.get("/profile/minimal", JobSeekerController.getMinimalProfile);

export default router;
