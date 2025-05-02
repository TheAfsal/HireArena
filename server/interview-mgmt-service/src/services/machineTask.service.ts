import GeminiHelper from "utils/gemini.helper";
import { evaluateRepository } from "../utils/evaluateTask";
import { IMachineTaskService } from "@core/interfaces/services/IMachineTaskService";
import { IMachineTaskRepository } from "@core/interfaces/repository/IMachineTaskRepository";
import { IMachineTask } from "model/MachineTask";
import { IRoundStatus, RoundStatus, RoundType } from "model/Interview";
import { IInterviewRepository } from "@core/interfaces/repository/IInterviewRepository";
import {
  CreateNotification,
  FindJobsByIds,
  IsJobExist,
} from "@config/grpcClient";

class MachineTaskService implements IMachineTaskService {
  constructor(
    private machineTaskRepo: IMachineTaskRepository,
    private interviewRepo: IInterviewRepository
  ) {}

  async createMachineTest(jobId: string, companyId: string): Promise<any> {
    const task = await GeminiHelper.generateMachineTask();

    console.log("@@ task: ", task);

    const savedTask: Partial<IMachineTask> = {
      jobId,
      companyId,
      title: task.title,
      description: task.description,
      hoursToComplete: task.hoursToComplete,
      requirements: task.requirements.map((r: string) => ({ requirement: r })),
      evaluationCriteria: task.evaluationCriteria.map((c: string) => ({
        criteria: c,
      })),
      createdAt: new Date(),
    };

    return await this.machineTaskRepo.createMachineTask(savedTask);
  }

  async fetchMachineTaskByJobId(jobId: string): Promise<Partial<IMachineTask>> {
    const task = await this.machineTaskRepo.getMachineTaskByJobId(jobId);
    if (!task) throw new Error("No machine task found for this job");
    return task;
  }

  async fetchMachineTaskDetails(
    taskId: string
  ): Promise<Partial<IMachineTask>> {
    const task = await this.machineTaskRepo.getMachineTaskDetails(taskId);
    if (!task) throw new Error("Machine task not found");
    return task;
  }

  async startMachineTask(taskId: string): Promise<{ startTime: Date }> {
    const task = await this.machineTaskRepo.findTaskById(taskId);
    if (!task) throw new Error("Task not found");

    if (task.startTime) return { startTime: task.startTime };

    const newStartTime = new Date();
    await this.machineTaskRepo.updateStartTime(taskId, newStartTime);

    return { startTime: newStartTime };
  }

  async isSubmissionAllowed(taskId: string): Promise<boolean> {
    const task = await this.machineTaskRepo.findTaskById(taskId);
    if (!task || !task.startTime) return false;

    const deadline = new Date(task.startTime);
    deadline.setHours(deadline.getHours() + task.hoursToComplete);

    return new Date() <= deadline;
  }

  async submitMachineTask(
    candidateId: string,
    taskId: string,
    repoUrl: string,
    jobId: string
  ): Promise<{ status: RoundStatus; evaluationScore: number }> {
    const machineTask = await this.machineTaskRepo.getTaskById(taskId);
    if (!machineTask) throw new Error("Machine Task not found");

    const evaluationScore = await evaluateRepository(repoUrl);

    console.log("evaluationScore", evaluationScore);

    const status =
      evaluationScore >= 70 ? RoundStatus.Completed : RoundStatus.Failed;

    const updatedInterview = await this.interviewRepo.updateMachineTaskStatus(
      candidateId,
      jobId,
      taskId,
      status
    );

    if (status === RoundStatus.Completed) {
      const testOptions: Array<string> = [
        "Technical Interview",
        "Behavioral Interview",
        "HR Interview",
      ];

      const jobDetails = await IsJobExist(jobId);

      const tests = JSON.parse(jobDetails.job.testOptions);

      if (!jobDetails) throw new Error("Job not found");

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

      let nextTest: Partial<IRoundStatus> | null = null;
      const now = new Date();

      if (updatedInterview.state.length - 1 === filteredArr.length) {
        console.log("Interview Completed");

        const existingJob = await FindJobsByIds([jobId]);

        await CreateNotification({
          userId: candidateId,
          message: `Interview Completed for for ${existingJob[0].jobTitle}`,
          type: "INTERVIEW_COMPLETED",
          relatedId: jobId,
        });

        return updatedInterview;
      } else {
        nextTest = {
          roundType: RoundType[filteredArr[updatedInterview.state.length]],
          status: RoundStatus.Pending,
          createdAt: now,
          updatedAt: now,
        };

        const existingJob = await FindJobsByIds([jobId]);

        await CreateNotification({
          userId: candidateId,
          message: `Machine Task Completed for ${existingJob[0].jobTitle}`,
          type: "INTERVIEW_COMPLETED",
          relatedId: jobId,
        });

        await CreateNotification({
          userId: candidateId,
          message: `New round ${nextTest.roundType} assigned for ${existingJob[0].jobTitle}`,
          type: "INTERVIEW_COMPLETED",
          relatedId: jobId,
        });

        console.log(nextTest);
        if (!nextTest) {
          throw new Error("No pending test found to schedule next.");
        }
        return await this.interviewRepo.addNextTest(
          updatedInterview._id,
          nextTest
        );
      }
    }

    const existingJob = await FindJobsByIds([jobId]);

    await CreateNotification({
      userId: candidateId,
      message: `Failed Machine for ${existingJob[0].jobTitle}`,
      type: "INTERVIEW_COMPLETED",
      relatedId: jobId,
    });

    return { status, evaluationScore };
  }
}

export default MachineTaskService;
