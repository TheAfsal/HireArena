export interface Interview {
    id: string;
    jobId: string;
    interviewerId: string;
    intervieweeId: string;
    scheduleTime: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface InterviewFeedback {
    id: string;
    interviewId: string;
    feedbackText: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  }
  