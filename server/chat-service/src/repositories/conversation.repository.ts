import { IConversation } from "@core/types/chat.types";
import { BaseRepository } from "./base.repository";
import { IConversationRepository } from "@core/interfaces/repository/IConversationRepository";
import { Conversation } from "model/conversation.model";

export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository
{
  constructor() {
    super(Conversation);
  }

  async createConversation(participants: string[], jobId?: string): Promise<IConversation> {
    return await this.create({ participants, jobId });
  }

  async findConversationById(id: string): Promise<IConversation | null> {
    return await this.findById(id);
  }
}