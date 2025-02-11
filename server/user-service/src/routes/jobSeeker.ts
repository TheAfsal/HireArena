import { Router } from "express";
import jobSeekerController from "../controllers/jobSeekerController";
import upload from "../middlewares/userProfileConfig";
import ProfileService from "../services/ProfileService";
import JobSeekerRepository from "../repositories/JobSeekerRepository";
import prisma from "../config/prismaClient";
import PasswordService from "../services/PasswordServices";

const jobSeekerRepository = new JobSeekerRepository(prisma);
const passwordService = new PasswordService();
const profileService = new ProfileService(jobSeekerRepository, passwordService);
const JobSeekerController = new jobSeekerController(profileService);

const router = Router();

router
  .route("/profile")
  .get(JobSeekerController.getProfile)
  .put(upload.any(), JobSeekerController.updateProfile);

router.put("/change-password", JobSeekerController.changePassword);
router.get("/profile/minimal", JobSeekerController.getMinimalProfile);


export default router;
