import { Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  content: string;
  timestamp: Date;
  roomId: string;
}