import { IConversation } from "@core/types/video.types";

export interface IConversationRepository {
  createConversation(
    participants: string[],
    jobId: string,
    companyName: string,
    logo: string
  ): Promise<IConversation>;
  findConversationById(id: string): Promise<IConversation | null>;
}
