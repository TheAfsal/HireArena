import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { VideoCallRepository } from "@repositories/videoCall.repository.ts";
import { IVideoCall } from "@core/types/video.types";

@injectable()
export class VideoCallService {
  constructor(
    @inject(TYPES.VideoCallRepository) private videoCallRepo: VideoCallRepository
  ) {}

  async startVideoCall(conversationId: string, participants: string[]): Promise<IVideoCall> {
    if (participants.length < 2) {
      throw new Error("At least two participants required for a video call");
    }
    return await this.videoCallRepo.createCall(conversationId, participants);
  }

  async getVideoCall(conversationId: string): Promise<IVideoCall | null> {
    return await this.videoCallRepo.findCallByConversationId(conversationId);
  }
}

export interface IVideoCallService {
  startVideoCall(conversationId: string, participants: string[]): Promise<IVideoCall>;
  getVideoCall(conversationId: string): Promise<IVideoCall | null>;
}