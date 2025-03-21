import { IUserConversations } from "@core/types/chat.types";
import mongoose, { Schema, Document } from "mongoose";

const userConversationsSchema = new Schema<IUserConversations>(
  {
    userId: { type: String, required: true, unique: true },
    conversationIds: [{ type: String }],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { updatedAt: "updatedAt" } }
);

export const UserConversations = mongoose.model<IUserConversations>(
  "UserConversations",
  userConversationsSchema
);