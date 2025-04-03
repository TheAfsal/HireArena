import { IConversation, IMessage, IMessageDTO } from "@core/types/video.types";

export interface IChatService {
  startConversation(
    participants: string[],
    jobId: string,
    companyName: string,
    logo: string
  ): Promise<IConversation>;
  sendMessage(message: IMessageDTO): Promise<IMessage>;
  getChatHistory(conversationId: string): Promise<IMessage[]>;
  getConversation(conversationId: string): Promise<IConversation | null>;
  getUserConversations(userId: string): Promise<IConversation[]>;
}
