export interface IMachineTaskService {
  fetchMachineTaskByJobId(jobId: string): Promise<any>;
  fetchMachineTaskDetails(taskId: string): Promise<any>;
  startMachineTask(taskId: string): Promise<{ startTime: Date }>;
  isSubmissionAllowed(taskId: string): Promise<boolean>;
  submitMachineTask(
    candidateId: string,
    taskId: string,
    repoUrl: string
  ): Promise<{ status: string; evaluationScore: number }>;
}
