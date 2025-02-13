import { Router } from "express";
import jobSeekerController from "../controllers/jobSeekerController";
import upload from "../middlewares/userProfileConfig";
import ProfileService from "../services/ProfileService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import prisma from "../config/prismaClient";
import PasswordService from "../services/PasswordServices";
import CompanyRepository from "../repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "../repositories/CompanyEmployeeRepository";
import AdminController from "../controllers/adminController";
import JobSeekerService from "../services/JobSeekerService";

const jobSeekerRepository = new JobSeekerRepository(prisma);
const jobSeekerService = new JobSeekerService(jobSeekerRepository);

const adminController = new AdminController(jobSeekerService);

const router = Router();

router
  .route("/candidates")
  .get(adminController.getAllCandidateProfile)
//   .put(upload.any(), JobSeekerController.updateProfile);

export default router;
