import express from "express";
// import MachineTaskRepository from "@repositories/machineTask.repository";
import MachineTaskService from "@services/machineTask.service";
import MachineTaskController from "@controllers/machineTask.controller";
import MachineTaskRepository from "@repositories/machineTask.repository";
import InterviewRepository from "@repositories/interview.repository";

const router = express.Router();

const machineTaskRepo = new MachineTaskRepository();
const interviewRepo = new InterviewRepository();
const machineTaskService = new MachineTaskService(machineTaskRepo, interviewRepo);
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
