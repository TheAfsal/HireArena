// src/routes/JobCategoryRoutes.ts
import { Router } from "express";
import JobCategoryRepository from "../repositories/JobCategoryRepository";
import prisma from "../config/prismaClient";
import { JobCategoryService } from "../services/JobCategoryService";
import { JobCategoryController } from "../controllers/jobCategoryController";

const router = Router();
const jobCategoryRepository = new JobCategoryRepository(prisma);

const jobCategoryService = new JobCategoryService(jobCategoryRepository);

const jobCategoryController = new JobCategoryController(jobCategoryService);

router.post("/create", jobCategoryController.create);
router.put("/update", jobCategoryController.update);
router.get("/:id", jobCategoryController.get);
router.get("/", jobCategoryController.getAll);
router.delete("/:id", jobCategoryController.delete);

export default router;
