import {
  IMachineTaskDetails,
  IMachineTaskPartial,
  IUpdateManyResult,
} from "@core/types/interview.types";
import { InterviewStatus, MachineTask } from "@prisma/client";

export interface IMachineTaskRepository {
  getMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial | null>;
  getMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails | null>;
  findTaskById(taskId: string): Promise<MachineTask | null>;
  updateStartTime(taskId: string, startTime: Date): Promise<MachineTask>;
  getTaskById(taskId: string): Promise<MachineTask | null>;
  updateCandidateTaskStatus(
    candidateId: string,
    taskId: string,
    status: InterviewStatus
  ): Promise<IUpdateManyResult>;
}
