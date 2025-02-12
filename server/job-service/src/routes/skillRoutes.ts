// src/routes/SkillRoutes.ts
import { Router } from "express";
import SkillRepository from "../repositories/SkillRepository";
import prisma from "../config/prismaClient";
import { SkillService } from "../services/SkillService";
import { SkillController } from "../controllers/skillController";

const router = Router();

const skillRepository = new SkillRepository(prisma);

const skillService = new SkillService(skillRepository);

const skillController = new SkillController(skillService);

router.post("/create", skillController.create);
router.put("/update", skillController.update);
router.get("/:id", skillController.get);
router.get("/", skillController.getAll);
router.delete("/:id", skillController.delete);

export default router;
