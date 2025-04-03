import { Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface IConversation extends Document {
  participants: string[];
  jobId: string;
  companyName: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDTO {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;
  status?: "sent" | "delivered" | "read";
}
export interface IUserConversations extends Document {
  userId: string;
  conversationIds: string[];
  updatedAt: Date;
}