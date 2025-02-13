import express, { Request, Response } from "express";
import JobService from "../services/jobSeekerService";
import JobController from "../controllers/adminController";
import AdminRepository from "../repositories/adminRepository";
import AdminService from "../services/jobSeekerService";
import AdminController from "../controllers/adminController";
import JobSeekerService from "../services/jobSeekerService";

const router = express.Router();

const jobSeekerService = new JobSeekerService();

const adminController = new AdminController(jobSeekerService);

router.get("/candidates",  adminController.getAllCandidates);

export default router;
