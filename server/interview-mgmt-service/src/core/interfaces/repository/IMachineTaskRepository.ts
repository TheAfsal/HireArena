import { InterviewStatus, MachineTask } from "@prisma/client";

export interface IMachineTaskRepository {
  getMachineTaskByJobId(jobId: string): Promise<any>;
  getMachineTaskDetails(taskId: string): Promise<MachineTask | null>;
  findTaskById(taskId: string): Promise<MachineTask | null>;
  updateStartTime(taskId: string, startTime: Date): Promise<MachineTask>;
  getTaskById(taskId: string): Promise<MachineTask | null>;
  updateCandidateTaskStatus(
    candidateId: string,
    taskId: string,
    status: InterviewStatus
  ): Promise<any>;
}
