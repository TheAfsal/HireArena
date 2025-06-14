"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import MachineTaskRepository from "../repositories/machineTask.repository";
const machineTask_service_1 = __importDefault(require("../services/machineTask.service"));
const machineTask_controller_1 = __importDefault(require("../controllers/machineTask.controller"));
const machineTask_repository_1 = __importDefault(require("../repositories/machineTask.repository"));
const interview_repository_1 = __importDefault(require("../repositories/interview.repository"));
const router = express_1.default.Router();
const machineTaskRepo = new machineTask_repository_1.default();
const interviewRepo = new interview_repository_1.default();
const machineTaskService = new machineTask_service_1.default(machineTaskRepo, interviewRepo);
const machineTaskController = new machineTask_controller_1.default(machineTaskService);
router.post("/start-task", machineTaskController.startTask);
router.get("/check-submission/:taskId", machineTaskController.checkSubmission);
router.post("/submit", machineTaskController.submitProject);
router.get("/job/:jobId", machineTaskController.getMachineTaskByJobId);
router.get("/:taskId", machineTaskController.getMachineTaskDetails);
exports.default = router;
