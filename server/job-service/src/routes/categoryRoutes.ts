// src/routes/CategoryRoutes.ts
import { Router } from "express";
import prisma from "../config/prismaClient";
import { CategoryService } from "../services/CategoryService";
import CategoryRepository from "../repositories/CategoryRepository";
import { CategoryController } from "../controllers/categoryController";

const router = Router();

const categoryRepository = new CategoryRepository(prisma);

const categoryService = new CategoryService(categoryRepository);

const categoryController = new CategoryController(categoryService);

router.post("/create", categoryController.create);
router.put("/update", categoryController.update);
router.get("/:id", categoryController.get);
router.get("/", categoryController.getAll);
router.delete("/:id", categoryController.delete);

export default router;
