import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledInterview {
  scheduledInterviewId: string; 
  candidateId: string; 
  time: Date; 
  link: string;
}

export interface IEmployeeInterviews extends Document {
  employeeId: string; 
  interviews: IScheduledInterview[];
  updatedAt: Date;
}

const ScheduledInterviewSchema: Schema = new Schema(
  {
    candidateId: { type: String, required: true }, 
    time: { type: Date, required: true },
    link: { type: String, required: true }
  },
);

const EmployeeInterviewsSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true }, 
    interviews: { type: [ScheduledInterviewSchema], default: [] },
  },
  { timestamps: { updatedAt: true, createdAt: false } } 
);

export default mongoose.model<IEmployeeInterviews>(
  "EmployeeInterviews",
  EmployeeInterviewsSchema
);