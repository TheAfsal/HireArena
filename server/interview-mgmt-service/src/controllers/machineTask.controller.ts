import { Request, Response } from "express";
import * as grpc from "@grpc/grpc-js";
import { IMachineTaskController } from "@core/interfaces/controllers/IMachineTaskController";
import { IMachineTaskService } from "@core/interfaces/services/IMachineTaskService";
import { StatusCodes } from "http-status-codes";
class MachineTaskController implements IMachineTaskController {
  constructor(private machineTaskService: IMachineTaskService) {}

  CreateMachineTask = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const { jobId, companyId } = call.request;

      if (!jobId || !companyId) throw new Error("Missing job id");

      console.log(`Generating machine test for job ${jobId}...`);

      let machineTest = await this.machineTaskService.createMachineTest(
        jobId,
        companyId
      );

      console.log("@@ machineTest : ", machineTest);

      return callback(null, { success: true });
    } catch (error) {
      console.log("Error creating aptitude test:", error);
      callback({
        code: grpc.status.INTERNAL,
      });
    }
  };

  getMachineTaskByJobId = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Job ID is required" });
        return;
      }

      const task = await this.machineTaskService.fetchMachineTaskByJobId(jobId);
      res.json({ success: true, task });
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };

  getMachineTaskDetails = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Task ID is required" });
        return;
      }

      const taskDetails = await this.machineTaskService.fetchMachineTaskDetails(
        taskId
      );

      console.log("@@ taskDetails : ", taskDetails);

      //@ts-ignore
      await this.machineTaskService.startMachineTask(taskDetails?._id);

      res.json({ success: true, task: taskDetails });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };

  startTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.body;
      if (!taskId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Task ID is required" });
        return;
      }

      const result = await this.machineTaskService.startMachineTask(taskId);
      res.status(StatusCodes.OK).json(result);
      return;
    } catch (error: any) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      return;
    }
  };

  checkSubmission = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const isAllowed = await this.machineTaskService.isSubmissionAllowed(
        taskId
      );
      res.status(StatusCodes.OK).json({ isAllowed });
      return;
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      return;
    }
  };

  submitProject = async (req: Request, res: Response) => {
    try {
      const { taskId, repoUrl, jobId } = req.body;

      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId || !taskId || !repoUrl) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing required fields" });
        return;
      }

      const result = await this.machineTaskService.submitMachineTask(
        userId,
        taskId,
        repoUrl,
        jobId
      );

      res.json(result);
    } catch (error) {
      console.error("Error submitting machine task:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  };
}

export default MachineTaskController;
