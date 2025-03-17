import { IMessage } from '@core/types/chat.types';
import mongoose, { Schema } from 'mongoose';

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  roomId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);