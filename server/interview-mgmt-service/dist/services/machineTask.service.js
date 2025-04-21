"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gemini_helper_1 = __importDefault(require("../utils/gemini.helper"));
const evaluateTask_1 = require("../utils/evaluateTask");
const Interview_1 = require("../model/Interview");
const grpcClient_1 = require("../config/grpcClient");
class MachineTaskService {
    constructor(machineTaskRepo, interviewRepo) {
        this.machineTaskRepo = machineTaskRepo;
        this.interviewRepo = interviewRepo;
    }
    async createMachineTest(jobId, companyId) {
        const task = await gemini_helper_1.default.generateMachineTask();
        console.log("@@ task: ", task);
        const savedTask = {
            jobId,
            companyId,
            title: task.title,
            description: task.description,
            hoursToComplete: task.hoursToComplete,
            requirements: task.requirements.map((r) => ({ requirement: r })),
            evaluationCriteria: task.evaluationCriteria.map((c) => ({
                criteria: c,
            })),
            createdAt: new Date(),
        };
        return await this.machineTaskRepo.createMachineTask(savedTask);
    }
    async fetchMachineTaskByJobId(jobId) {
        const task = await this.machineTaskRepo.getMachineTaskByJobId(jobId);
        if (!task)
            throw new Error("No machine task found for this job");
        return task;
    }
    async fetchMachineTaskDetails(taskId) {
        const task = await this.machineTaskRepo.getMachineTaskDetails(taskId);
        if (!task)
            throw new Error("Machine task not found");
        return task;
    }
    async startMachineTask(taskId) {
        const task = await this.machineTaskRepo.findTaskById(taskId);
        if (!task)
            throw new Error("Task not found");
        if (task.startTime)
            return { startTime: task.startTime };
        const newStartTime = new Date();
        await this.machineTaskRepo.updateStartTime(taskId, newStartTime);
        return { startTime: newStartTime };
    }
    async isSubmissionAllowed(taskId) {
        const task = await this.machineTaskRepo.findTaskById(taskId);
        if (!task || !task.startTime)
            return false;
        const deadline = new Date(task.startTime);
        deadline.setHours(deadline.getHours() + task.hoursToComplete);
        return new Date() <= deadline;
    }
    async submitMachineTask(candidateId, taskId, repoUrl, jobId) {
        const machineTask = await this.machineTaskRepo.getTaskById(taskId);
        if (!machineTask)
            throw new Error("Machine Task not found");
        const evaluationScore = await (0, evaluateTask_1.evaluateRepository)(repoUrl);
        console.log("evaluationScore", evaluationScore);
        const status = evaluationScore >= 70 ? Interview_1.RoundStatus.Completed : Interview_1.RoundStatus.Failed;
        const updatedInterview = await this.interviewRepo.updateMachineTaskStatus(candidateId, jobId, taskId, status);
        if (status === Interview_1.RoundStatus.Completed) {
            const testOptions = [
                "Technical Interview",
                "Behavioral Interview",
                "HR Interview",
            ];
            const jobDetails = await (0, grpcClient_1.IsJobExist)(jobId);
            const tests = JSON.parse(jobDetails.job.testOptions);
            if (!jobDetails)
                throw new Error("Job not found");
            const priorityOrder = [
                "Aptitude Test",
                "Machine Task",
                "Coding Challenge",
                "Technical Interview",
                "Behavioral Interview",
                "HR Interview",
                "CEO Interview",
            ];
            const filteredArr = priorityOrder.filter((task) => tests[task] === true);
            console.log("@@filteredArr ", filteredArr);
            let nextTest = null;
            const now = new Date();
            if ((updatedInterview.state.length - 1) === filteredArr.length) {
                console.log("Interview Completed");
                return updatedInterview;
            }
            else {
                nextTest = {
                    roundType: Interview_1.RoundType[filteredArr[updatedInterview.state.length]],
                    status: Interview_1.RoundStatus.Pending,
                    createdAt: now,
                    updatedAt: now,
                };
                console.log(nextTest);
                if (!nextTest) {
                    throw new Error("No pending test found to schedule next.");
                }
                return await this.interviewRepo.addNextTest(updatedInterview._id, nextTest);
            }
        }
        return { status, evaluationScore };
    }
}
exports.default = MachineTaskService;
