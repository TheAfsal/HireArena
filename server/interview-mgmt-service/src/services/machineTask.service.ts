import GeminiHelper from "../utils/gemini.helper";
import MachineTaskRepository from "../repositories/machineTask.repository";
import { evaluateRepository } from "../utils/evaluateTask";
import { InterviewStatus } from "@prisma/client";

class MachineTaskService {
  constructor(private machineTaskRepository: MachineTaskRepository) {}

  // Fetch Machine Task (Introduction Page)
  async fetchMachineTaskByJobId(jobId: string) {
    const task = await this.machineTaskRepository.getMachineTaskByJobId(jobId);
    if (!task) throw new Error("No machine task found for this job");
    return task;
  }

  async fetchMachineTaskDetails(taskId: string) {
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

  // async evaluateProject(repoUrl: string) {
  //   const files = await this.machineTaskRepository.fetchRepositoryFiles(
  //     repoUrl
  //   );

  //   const evaluation = await GeminiHelper.evaluateCode(files);

  //   const score = evaluation.score;
  //   const status = score >= 70 ? "Passed" : "Failed";

  //   return { score, status, details: evaluation.details };
  // }

  async submitMachineTask(
    candidateId: string,
    taskId: string,
    repoUrl: string
  ) {
    const machineTask = await this.machineTaskRepository.getTaskById(taskId);
    if (!machineTask) throw new Error("Machine Task not found");


    console.log("!!!",);
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
