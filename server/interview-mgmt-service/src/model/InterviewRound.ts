// import mongoose, { Schema, Document } from "mongoose";

// export enum RoundType {
//   Aptitude = "aptitude",
//   MachineTask = "machine_task",
//   Technical = "technical",
//   HR = "HR",
//   Final = "final",
// }

// export enum RoundStatus {
//   Pending = "pending",
//   Ongoing = "ongoing",
//   Completed = "completed",
//   Failed = "failed",
// }

// export interface IInterviewRound extends Document {
//   interviewId: string;
//   roundType: RoundType;
//   status: RoundStatus;
//   scheduledAt: Date;
//   completedAt?: Date;
//   remarks?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const InterviewRoundSchema: Schema = new Schema(
//   {
//     interviewId: { type: Schema.Types.ObjectId, ref: "Interview", required: true },
//     roundType: { type: String, enum: Object.values(RoundType), required: true },
//     status: { type: String, enum: Object.values(RoundStatus), required: true },
//     scheduledAt: { type: Date, required: true },
//     completedAt: { type: Date },
//     remarks: { type: String },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IInterviewRound>("InterviewRound", InterviewRoundSchema);