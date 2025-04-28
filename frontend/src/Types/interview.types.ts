export interface ScheduleForm {
  interviewId: string;
  scheduledAt: Date | null;
}

export interface UpcomingInterview {
  scheduledInterviewId: string;
  candidateId: string;
  time: string;
  link: string;
  _id: string;
}

export interface ResultForm {
  interviewId: string;
  candidateId: string;
  remarks: string;
  status: "passed" | "failed";
}

