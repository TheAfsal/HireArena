import { IConversationRepository } from "@core/interfaces/repository/IConversationRepository";
import { IMessageRepository } from "@core/interfaces/repository/IMessageRepository";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IConversation, IMessage, IMessageDTO } from "@core/types/chat.types";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ConversationRepository) private conversationRepo: IConversationRepository,
    @inject(TYPES.MessageRepository) private messageRepo: IMessageRepository
  ) {}
  async startConversation(
    participants: string[],
    jobId?: string
  ): Promise<IConversation> {
    if (participants.length < 2) {
      throw new Error("At least two participants are required");
    }
    return await this.conversationRepo.createConversation(participants, jobId);
  }

  async sendMessage(
    message: IMessageDTO
  ): Promise<IMessage> {
    const newMessage: IMessage = {
      ...message,
      id: new Date().toISOString(), 
      status: "sent",
    } as IMessage;
    return await this.messageRepo.saveMessage(newMessage);
  }

  async getChatHistory(conversationId: string): Promise<IMessage[]> {
    return await this.messageRepo.getMessagesByConversationId(conversationId);
  }
}
