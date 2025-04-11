import { IVideoCall } from "@core/types/video.types";
import { Schema, model, Document } from "mongoose";

export interface IVideoCallDocument extends IVideoCall, Document {}

const videoCallSchema = new Schema<IVideoCallDocument>({
  conversationId: { type: String, required: true, unique: true },
  participants: [{ type: String, required: true }],
  startedAt: { type: Date, default: Date.now },
});

export const VideoCall = model<IVideoCallDocument>("VideoCall", videoCallSchema);