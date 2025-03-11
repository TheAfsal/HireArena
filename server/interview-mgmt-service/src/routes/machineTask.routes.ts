import express from "express";
import { PrismaClient } from "@prisma/client";
import MachineTaskRepository from "../repositories/machineTask.repository";
import MachineTaskService from "../services/machineTask.service";
import MachineTaskController from "../controllers/machineTask.controller";

const router = express.Router();
const prisma = new PrismaClient();

const machineTaskRepository = new MachineTaskRepository(prisma);
const machineTaskService = new MachineTaskService(machineTaskRepository);
const machineTaskController = new MachineTaskController(machineTaskService);

router.post("/start-task", machineTaskController.startTask);
router.get("/check-submission/:taskId", machineTaskController.checkSubmission);
router.post("/submit", machineTaskController.submitProject);


router.get(
  "/job/:jobId",
  machineTaskController.getMachineTaskByJobId
);

router.get(
  "/:taskId",
  machineTaskController.getMachineTaskDetails
);

export default router;
