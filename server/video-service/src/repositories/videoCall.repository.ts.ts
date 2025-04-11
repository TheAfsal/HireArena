import { injectable } from "inversify";
import { VideoCall, IVideoCallDocument } from "../model/videoCall";
import { IVideoCall } from "@core/types/video.types";

@injectable()
export class VideoCallRepository implements IVideoCallRepository{
  async createCall(conversationId: string, participants: string[]): Promise<IVideoCall> {
    const call = new VideoCall({ conversationId, participants });
    return await call.save();
  }

  async findCallByConversationId(conversationId: string): Promise<IVideoCall | null> {
    return await VideoCall.findOne({ conversationId }).exec();
  }
}

export interface IVideoCallRepository {
  createCall(conversationId: string, participants: string[]): Promise<IVideoCall>;
  findCallByConversationId(conversationId: string): Promise<IVideoCall | null>;
}