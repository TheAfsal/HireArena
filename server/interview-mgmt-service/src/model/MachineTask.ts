import mongoose, { Schema, Document } from "mongoose";

export interface IMachineTask extends Document {
  id: string; 
  jobId: string;
  companyId: string;
  title: string;
  description: string;
  hoursToComplete: number;
  createdAt: Date;
  startTime?: Date;
  requirements?: any[]; 
  evaluationCriteria?: any[];
}

const MachineTaskSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    jobId: { type: String, required: true },
    companyId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    hoursToComplete: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    startTime: { type: Date },
    requirements: [{ type: Schema.Types.ObjectId, ref: "MachineTaskRequirement" }],
    evaluationCriteria: [{ type: Schema.Types.ObjectId, ref: "MachineTaskEvaluation" }],
  },
  { timestamps: false }
);

export default mongoose.model<IMachineTask>("MachineTask", MachineTaskSchema);