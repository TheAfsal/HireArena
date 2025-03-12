export interface IInterviewService {
    fetchAptitudeQuestions(interviewId: string): Promise<any>;
    fetchAppliedJobStatus(jobId: string, userId: string): Promise<string>;
  }
  
    