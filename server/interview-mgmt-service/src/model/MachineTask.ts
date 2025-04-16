import mongoose, { Schema, Document } from "mongoose";

interface Requirement {
  requirement: string;
}

interface EvaluationCriteria {
  criteria: string;
}

export interface IMachineTask extends Document {
  jobId: string;
  companyId: string;
  title: string;
  description: string;
  hoursToComplete: number;
  createdAt: Date;
  startTime?: Date;
  requirements: Requirement[];
  evaluationCriteria: EvaluationCriteria[];
}

const RequirementSchema = new Schema<Requirement>(
  {
    requirement: { type: String, required: true },
  },
  { _id: false }
);

const EvaluationSchema = new Schema<EvaluationCriteria>(
  {
    criteria: { type: String, required: true },
  },
  { _id: false }
);

const MachineTaskSchema = new Schema<IMachineTask>(
  {
    jobId: { type: String, required: true },
    companyId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    hoursToComplete: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    startTime: { type: Date },
    requirements: [RequirementSchema],
    evaluationCriteria: [EvaluationSchema],
  },
  { timestamps: false }
);

export default mongoose.model<IMachineTask>("MachineTask", MachineTaskSchema);
