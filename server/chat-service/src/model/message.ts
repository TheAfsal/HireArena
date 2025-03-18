import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "@core/types/chat.types";

export interface IMessageDocument extends IMessage, Document {}

const messageSchema = new Schema<IMessageDocument>({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
});

export const Message = mongoose.model<IMessageDocument>("Message", messageSchema);