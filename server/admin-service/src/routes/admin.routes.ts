import express from "express";
import container from "di/container";
import { IAdminController } from "@core/interfaces/controllers/IAdminController";
import { TYPES } from "di/types";

const router = express.Router();

const adminController = container.get<IAdminController>(TYPES.AdminController);

router.get("/candidates", adminController.getAllCandidates);

export default router;
