import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  type: "INTERVIEW_SCHEDULED" | "JOB_APPLICATION" | "INTERVIEW_COMPLETED" | "GENERAL";
  read: boolean;
  createdAt: Date;
  relatedId?: string;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["INTERVIEW_SCHEDULED", "JOB_APPLICATION", "INTERVIEW_COMPLETED", "GENERAL"],
    required: true,
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  relatedId: { type: String },
});

export default mongoose.model<INotification>("Notification", notificationSchema);