import { IUserConversations } from "@core/types/chat.types";
import { BaseRepository } from "./base.repository";
import { UserConversations } from "model/userConversations.model";
import { IUserConversationsRepository } from "@core/interfaces/repository/IUserConversationRepository";

export class UserConversationsRepository extends BaseRepository<IUserConversations> implements IUserConversationsRepository {
  constructor() {
    super(UserConversations);
  }

  async upsertUserConversation(
    userId: string,
    conversationId: string
  ): Promise<IUserConversations> {
    return await UserConversations.findOneAndUpdate(
      { userId },
      { $addToSet: { conversationIds: conversationId }, updatedAt: new Date() },
      { upsert: true, new: true }
    ).exec();
  }

  async getUserConversations(userId: string): Promise<IUserConversations | null> {
    return await this.findOne({ userId });
  }
}