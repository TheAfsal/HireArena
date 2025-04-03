import { IConversation } from "@core/types/chat.types";
import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: String, required: true }],
    jobId: { type: String },
    companyName: { type: String },
    logo: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);