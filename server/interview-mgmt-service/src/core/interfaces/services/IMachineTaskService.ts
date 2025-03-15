import { IMachineTaskDetails, IMachineTaskPartial } from "@core/types/interview.types";
import { InterviewStatus } from "@prisma/client";

export interface IMachineTaskService {
  fetchMachineTaskByJobId(jobId: string): Promise<IMachineTaskPartial>;
  fetchMachineTaskDetails(taskId: string): Promise<IMachineTaskDetails>;
  startMachineTask(taskId: string): Promise<{ startTime: Date }>;
  isSubmissionAllowed(taskId: string): Promise<boolean>;
  submitMachineTask(
    candidateId: string,
    taskId: string,
    repoUrl: string
  ): Promise<{ status: InterviewStatus; evaluationScore: number }>;
}