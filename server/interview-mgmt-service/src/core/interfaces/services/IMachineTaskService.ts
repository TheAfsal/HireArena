import { RoundStatus } from "model/Interview";
import { IMachineTask } from "model/MachineTask";

export interface IMachineTaskService {
  createMachineTest(jobId: string, companyId:string): Promise<any>
  fetchMachineTaskByJobId(jobId: string): Promise<Partial<IMachineTask>>;
  fetchMachineTaskDetails(taskId: string): Promise<Partial<IMachineTask>>;
  startMachineTask(taskId: string): Promise<{ startTime: Date }>;
  isSubmissionAllowed(taskId: string): Promise<boolean>;
  submitMachineTask(
    candidateId: string,
    taskId: string,
    repoUrl: string,
    jobId: string
  ): Promise<{ status: RoundStatus; evaluationScore: number }>;
}