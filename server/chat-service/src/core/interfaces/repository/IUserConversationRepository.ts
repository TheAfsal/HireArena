import { IUserConversations } from "@core/types/chat.types";

export interface IUserConversationsRepository {
  upsertUserConversation(userId: string, conversationId: string): Promise<IUserConversations>;
  getUserConversations(userId: string): Promise<IUserConversations | null>;
}