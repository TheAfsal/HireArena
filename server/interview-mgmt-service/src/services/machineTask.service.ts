import MachineTaskRepository from "../repositories/machineTask.repository";
import { evaluateRepository } from "../utils/evaluateTask";
import { InterviewStatus, MachineTask, MachineTaskEvaluation, MachineTaskRequirement } from "@prisma/client";
import { IMachineTaskService } from "@core/interfaces/services/IMachineTaskService";
import { IMachineTaskRepository } from "@core/interfaces/repository/IMachineTaskRepository";
import { IMachineTaskDetails, IMachineTaskPartial } from "@core/types/interview.types";


class MachineTaskService implements IMachineTaskService {
  constructor(private machineTaskRepository: IMachineTaskRepository) {}

  async fetchMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial> {
    const task = await this.machineTaskRepository.getMachineTaskByJobId(jobId);
    if (!task) throw new Error("No machine task found for this job");
    return task;
  }

  async fetchMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails> {
    const task = await this.machineTaskRepository.getMachineTaskDetails(taskId);
    if (!task) throw new Error("Machine task not found");
    return task;
  }

  async startMachineTask(taskId: string): Promise<{ startTime: Date }> {
    const task = await this.machineTaskRepository.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.startTime) return { startTime: task.startTime };

    const newStartTime = new Date();
    await this.machineTaskRepository.updateStartTime(taskId, newStartTime);

    return { startTime: newStartTime };
  }

  async isSubmissionAllowed(taskId: string): Promise<boolean> {
    const task = await this.machineTaskRepository.findTaskById(taskId);
    if (!task || !task.startTime) return false;

    const deadline = new Date(task.startTime);
    deadline.setHours(deadline.getHours() + task.hoursToComplete);

    return new Date() <= deadline;
  }

  async submitMachineTask(
    candidateId: string,
    taskId: string,
    repoUrl: string
  ): Promise<{ status: InterviewStatus; evaluationScore: number }> {
    const machineTask = await this.machineTaskRepository.getTaskById(taskId);
    if (!machineTask) throw new Error("Machine Task not found");

    console.log("!!!");
    const evaluationScore = await evaluateRepository(repoUrl);

    console.log("evaluationScore", evaluationScore);

    const status =
      evaluationScore >= 70
        ? InterviewStatus.completed
        : InterviewStatus.failed;

    await this.machineTaskRepository.updateCandidateTaskStatus(
      candidateId,
      taskId,
      status
    );

    return { status, evaluationScore };
  }
}

export default MachineTaskService;