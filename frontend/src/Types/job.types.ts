export interface IRoundStatus {
  roundType: RoundType;
  status: RoundStatus;
  scheduledAt?: Date;
  completedAt?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum RoundType {
  AptitudeTest = "Aptitude Test",
  MachineTask = "Machine Task",
  TechnicalInterview = "Technical Interview",
  BehavioralInterview = "Behavioral Interview",
  CodingChallenge = "Coding Challenge",
  HrInterview = "Hr Interview",
  ManagerInterview = "Manager Interview",
}

export interface IInterview {
  _id: string;
  jobId: string;
  candidateId: string;
  state: IRoundStatus[];
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum RoundStatus {
  Scheduled = "scheduled",
  Completed = "completed",
  Canceled = "canceled",
  Pending = "pending",
  Failed = "failed",
}

export interface ICandidate {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  yearsOfExperience: string;
  currentJobTitle: string;
  location: string;
  skills: string[];
}


export enum JobType {
    FullTime = "Full Time",
    PartTime = "Part Time",
    Contract = "Contract",
    Internship = "Internship",
    Remote = "Remote",
  }
  
  export enum JobStatus {
    Open = "open",
    Closed = "closed",
    Draft = "draft",
  }
  