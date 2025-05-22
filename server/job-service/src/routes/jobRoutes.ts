import express from "express";
import JobService from "@services/JobService";
import prisma from "@config/prismaClient";
import JobRepository from "@repositories/JobRepository";
import JobController from "@controllers/jobController";
import { validateJob } from "../middlewares/validateRequest";
import JobApplicationRepository from "@repositories/JobApplicationRepository";

const router = express.Router();

const jobRepository = new JobRepository(prisma);
const jobApplicationRepository = new JobApplicationRepository(prisma);

const jobService = new JobService(jobRepository, jobApplicationRepository);

const jobController = new JobController(jobService);

router.get("/brief", jobController.getAllJobsBrief);

router.get("/", jobController.getAllJobs);
router.post("/", validateJob, jobController.createJob);

router.get("/company", jobController.getCompanyJobs);
router.get("/admin", jobController.getAllJobsForAdmin);

router.get("/filter", jobController.getFilteredJobs);

router.patch("/:id", jobController.updateJob);
router.get("/:id", jobController.getJob);

export default router;
