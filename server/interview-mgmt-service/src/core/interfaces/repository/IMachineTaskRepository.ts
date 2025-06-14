// import {
//   IMachineTaskDetails,
//   IMachineTaskPartial,
//   IUpdateManyResult,
// } from "@core/types/interview.types";
// import { InterviewStatus, MachineTask } from "@prisma/client";

import { RoundStatus } from "model/Interview";
import { IMachineTask } from "model/MachineTask";

// export interface IMachineTaskRepository {
//   getMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial | null>;
//   getMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails | null>;
//   findTaskById(taskId: string): Promise<MachineTask | null>;
//   updateStartTime(taskId: string, startTime: Date): Promise<MachineTask>;
//   getTaskById(taskId: string): Promise<MachineTask | null>;
//   updateCandidateTaskStatus(
//     candidateId: string,
//     taskId: string,
//     status: InterviewStatus
//   ): Promise<IUpdateManyResult>;
// }


// import { IMachineTaskDetails, IMachineTaskPartial, IUpdateManyResult } from "@core/types/interview.types";
// import { IBaseRepository } from "./IBaseRepository";

// export interface IMachineTaskRepository extends IBaseRepository<MachineTask, string> {
//   getMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial | null>;
//   getMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails | null>;
//   findTaskById(taskId: string): Promise<MachineTask | null>;
//   updateStartTime(taskId: string, startTime: Date): Promise<MachineTask>;
//   getTaskById(taskId: string): Promise<MachineTask | null>;
//   updateCandidateTaskStatus(
//     candidateId: string,
//     taskId: string,
//     status: InterviewStatus
//   ): Promise<IUpdateManyResult>;
// }

// import { IMachineTaskDetails, IMachineTaskPartial, IUpdateManyResult } from "@core/types/interview.types";
// import { IMachineTask } from "model/MachineTask";
// import { InterviewStatus } from "model/Interview";

export interface IMachineTaskRepository {
    createMachineTask(machinetask: Partial<IMachineTask>): Promise<Partial<IMachineTask>>
  getMachineTaskByJobId(jobId: string): Promise<Partial<IMachineTask> | null>;
  getMachineTaskDetails(taskId: string): Promise<Partial<IMachineTask> | null>;
  findTaskById(taskId: string): Promise<IMachineTask | null>;
  updateStartTime(taskId: string, startTime: Date): Promise<IMachineTask>;
  getTaskById(taskId: string): Promise<IMachineTask | null>;
  updateCandidateTaskStatus(
    candidateId: string,
    jobId: string,
    taskId: string,
    status: RoundStatus
  ): Promise<any>;
}