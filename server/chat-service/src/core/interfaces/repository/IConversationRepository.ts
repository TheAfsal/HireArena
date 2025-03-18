import { IConversation } from "@core/types/chat.types";

export interface IConversationRepository {
  createConversation(participants: string[], jobId?: string): Promise<IConversation>;
  findConversationById(id: string): Promise<IConversation | null>;
}