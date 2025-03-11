import { Request, Response } from "express";
import MachineTaskService from "../services/machineTask.service";

class MachineTaskController {
  constructor(private machineTaskService: MachineTaskService) {}

  getMachineTaskByJobId = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      console.log("jobId", jobId);

      if (!jobId) {
        res.status(400).json({ success: false, message: "Job ID is required" });
        return;
      }

      const task = await this.machineTaskService.fetchMachineTaskByJobId(jobId);
      res.json({ success: true, task });
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  };

  getMachineTaskDetails = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        res
          .status(400)
          .json({ success: false, message: "Task ID is required" });
        return;
      }

      const taskDetails = await this.machineTaskService.fetchMachineTaskDetails(
        taskId
      );
      res.json({ success: true, task: taskDetails });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  };

  startTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.body;
      if (!taskId) {
        res.status(400).json({ message: "Task ID is required" });
        return;
      }

      const result = await this.machineTaskService.startMachineTask(taskId);
      res.status(200).json(result);
      return;
    } catch (error: any) {
      console.log(error);

      res.status(500).json({ message: error.message });
      return;
    }
  };

  checkSubmission = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const isAllowed = await this.machineTaskService.isSubmissionAllowed(
        taskId
      );
      res.status(200).json({ isAllowed });
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  };

  submitProject = async (req: Request, res: Response) => {
    try {
      const { taskId, repoUrl } = req.body;

      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId || !taskId || !repoUrl) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const result = await this.machineTaskService.submitMachineTask(
        userId,
        taskId,
        repoUrl
      );

      res.json(result);
    } catch (error) {
      console.error("Error submitting machine task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default MachineTaskController;
