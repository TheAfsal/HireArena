"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
class MachineTaskController {
    constructor(machineTaskService) {
        this.machineTaskService = machineTaskService;
        this.CreateMachineTask = async (call, callback) => {
            try {
                const { jobId, companyId } = call.request;
                if (!jobId || !companyId)
                    throw new Error("Missing job id");
                console.log(`Generating machine test for job ${jobId}...`);
                let machineTest = await this.machineTaskService.createMachineTest(jobId, companyId);
                console.log("@@ machineTest : ", machineTest);
                return callback(null, { success: true });
            }
            catch (error) {
                console.log("Error creating aptitude test:", error);
                callback({
                    code: grpc.status.INTERNAL,
                });
            }
        };
        this.getMachineTaskByJobId = async (req, res) => {
            try {
                const { jobId } = req.params;
                if (!jobId) {
                    res.status(400).json({ success: false, message: "Job ID is required" });
                    return;
                }
                const task = await this.machineTaskService.fetchMachineTaskByJobId(jobId);
                res.json({ success: true, task });
            }
            catch (error) {
                console.log(error);
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
        this.getMachineTaskDetails = async (req, res) => {
            try {
                const { taskId } = req.params;
                if (!taskId) {
                    res
                        .status(400)
                        .json({ success: false, message: "Task ID is required" });
                    return;
                }
                const taskDetails = await this.machineTaskService.fetchMachineTaskDetails(taskId);
                console.log("@@ taskDetails : ", taskDetails);
                //@ts-ignore
                await this.machineTaskService.startMachineTask(taskDetails?._id);
                res.json({ success: true, task: taskDetails });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
        this.startTask = async (req, res) => {
            try {
                const { taskId } = req.body;
                if (!taskId) {
                    res.status(400).json({ message: "Task ID is required" });
                    return;
                }
                const result = await this.machineTaskService.startMachineTask(taskId);
                res.status(200).json(result);
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.checkSubmission = async (req, res) => {
            try {
                const { taskId } = req.params;
                const isAllowed = await this.machineTaskService.isSubmissionAllowed(taskId);
                res.status(200).json({ isAllowed });
                return;
            }
            catch (error) {
                res.status(500).json({ message: error.message });
                return;
            }
        };
        this.submitProject = async (req, res) => {
            try {
                const { taskId, repoUrl, jobId } = req.body;
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                if (!userId || !taskId || !repoUrl) {
                    res.status(400).json({ message: "Missing required fields" });
                    return;
                }
                const result = await this.machineTaskService.submitMachineTask(userId, taskId, repoUrl, jobId);
                res.json(result);
            }
            catch (error) {
                console.error("Error submitting machine task:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
    }
}
exports.default = MachineTaskController;
