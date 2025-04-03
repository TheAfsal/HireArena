import { Schema, model, Document } from "mongoose";
import { IVideoCall } from "../types/videoCall.types";

export interface IVideoCallDocument extends IVideoCall, Document {}

const videoCallSchema = new Schema<IVideoCallDocument>({
  conversationId: { type: String, required: true, unique: true },
  participants: [{ type: String, required: true }],
  startedAt: { type: Date, default: Date.now },
});

export const VideoCall = model<IVideoCallDocument>("VideoCall", videoCallSchema);