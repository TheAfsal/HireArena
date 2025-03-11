import express, { Request, Response } from "express";
import AdminController from "@controllers/admin.controller";
import JobSeekerService from "@services/jobSeeker.service";

const router = express.Router();

const jobSeekerService = new JobSeekerService();

const adminController = new AdminController(jobSeekerService);

router.get("/candidates",  adminController.getAllCandidates);

export default router;
