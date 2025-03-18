import { IConversation, IMessage, IMessageDTO } from "@core/types/chat.types";

export interface IChatService {
  startConversation(participants: string[], jobId?: string): Promise<IConversation>;
  sendMessage(message: IMessageDTO): Promise<IMessage>;  
  getChatHistory(conversationId: string): Promise<IMessage[]>;
}