import mongoose, { Schema, Document } from "mongoose";

// Enums
export enum RoundType {
  "Aptitude Test" = "Aptitude Test",
  "Machine Task" = "Machine Task",
  "Technical Interview" = "Technical Interview",
  "Behavioral Interview" = "Behavioral Interview",
  "Coding Challenge" = "Coding Challenge",
  // HR = "hr",
  // Final = "final"
}

export enum RoundStatus {
  Scheduled = "scheduled",
  Completed = "completed",
  Canceled = "canceled",
  Pending = "pending",
  Failed = "failed"
}

export interface IRoundStatus {
  roundType: RoundType;
  status: RoundStatus;
  scheduledAt?: Date;
  completedAt?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterview extends Document {
  jobId: string;
  candidateId: string;
  state: IRoundStatus[];
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoundStatusSchema: Schema = new Schema(
  {
    roundType: {
      type: String,
      // enum: Object.values(RoundType),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(RoundStatus),
      required: true
    },
    testResultId: { 
      type: Schema.Types.ObjectId, 
      ref: 'AptitudeTestResult',
      required: false 
    },
    scheduledAt: { type: Date, required: true, default: Date.now  },
    completedAt: { type: Date },
    remarks: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const InterviewSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true },
    candidateId: { type: String, required: true, index: true },
    state: { type: [RoundStatusSchema], required: true },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<IInterview>("Interview", InterviewSchema);