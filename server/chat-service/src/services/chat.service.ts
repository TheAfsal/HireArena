import { IConversationRepository } from "@core/interfaces/repository/IConversationRepository";
import { IMessageRepository } from "@core/interfaces/repository/IMessageRepository";
import { IUserConversationsRepository } from "@core/interfaces/repository/IUserConversationRepository";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IConversation, IMessage, IMessageDTO } from "@core/types/chat.types";
import { TYPES } from "@di/types";
import { inject, injectable } from "inversify";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ConversationRepository)
    private conversationRepo: IConversationRepository,
    @inject(TYPES.MessageRepository) private messageRepo: IMessageRepository,
    @inject(TYPES.UserConversationsRepository)
    private userConversationsRepo: IUserConversationsRepository
  ) {}

  async startConversation(
    participants: string[],
    jobId: string,
    companyName: string,
    logo: string
  ) {
    if (participants.length < 2) {
      throw new Error("At least two participants are required");
    }

    const conversation = await this.conversationRepo.createConversation(
      participants,
      jobId,
      companyName,
      logo
    );

    await Promise.all(
      participants.map((userId) =>
        this.userConversationsRepo.upsertUserConversation(
          userId,
          conversation.id
        )
      )
    );

    return conversation;
  }

  async sendMessage(message: IMessageDTO) {
    const newMessage: IMessage = {
      ...message,
      id: new Date().toISOString(),
      status: "sent",
    } as IMessage;
    return await this.messageRepo.saveMessage(newMessage);
  }

  async getChatHistory(conversationId: string) {
    return await this.messageRepo.getMessagesByConversationId(conversationId);
  }

  async getConversation(conversationId: string) {
    return await this.conversationRepo.findConversationById(conversationId);
  }

  async getUserConversations(userId: string): Promise<IConversation[]> {
    const userConversations =
      await this.userConversationsRepo.getUserConversations(userId);
    if (!userConversations || !userConversations.conversationIds.length) {
      return [];
    }

    const conversations = await Promise.all(
      userConversations.conversationIds.map((conversationId) =>
        this.conversationRepo.findConversationById(conversationId)
      )
    );

    return conversations.filter((conv): conv is IConversation => conv !== null);
  }

  async markMessagesRead(
    conversationId: string,
    userId: string
  ): Promise<IMessage[]> {
    const messages = await this.messageRepo.getMessagesByConversationId(
      conversationId
    );
    const unreadMessages = messages.filter(
      (msg) => msg.receiverId === userId && msg.status !== "read"
    );
    for (const message of unreadMessages) {
      await this.messageRepo.updateMessageStatus(message.id, "read");
    }
    return unreadMessages;
  }
}
