import express, { Request, Response } from "express";
import JobService from "../services/JobService";
import prisma from "../config/prismaClient";
import JobRepository from "../repositories/JobRepository";
import JobController from "../controllers/jobController";
import { validateJob } from "../middlewares/validateRequest";

const router = express.Router();

const jobRepository = new JobRepository(prisma);

const jobService = new JobService(jobRepository);

const jobController = new JobController(jobService);

router.get("/",  jobController.getAllJobs);
router.post("/", validateJob, jobController.createJob);

export default router;
