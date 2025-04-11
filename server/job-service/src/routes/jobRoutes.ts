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
// router.get("/", jobController.getFilteredJobs);
// router.get("/", jobController.getAllJobs);
router.post("/", validateJob, jobController.createJob);
router.get("/company", jobController.getCompanyJobs);

router.get("/filter", jobController.getFilteredJobs);

// router.post("/apply", jobController.applyJob);
// router.get("/apply/:id", jobController.getApplicationStatus);
// router.get("/my-applications", jobController.getAllApplications);

router.get("/:id", jobController.getJob);

export default router;
