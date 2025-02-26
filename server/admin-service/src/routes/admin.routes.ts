import express, { Request, Response } from "express";
import JobService from "../services/jobSeeker.service";
import JobController from "../controllers/admin.controller";
import AdminRepository from "../repositories/admin.repository";
import AdminService from "../services/jobSeeker.service";
import AdminController from "../controllers/admin.controller";
import JobSeekerService from "../services/jobSeeker.service";

const router = express.Router();

const jobSeekerService = new JobSeekerService();

const adminController = new AdminController(jobSeekerService);

router.get("/candidates",  adminController.getAllCandidates);

export default router;
