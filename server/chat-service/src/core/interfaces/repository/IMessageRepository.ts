import { IMessage } from "@core/types/chat.types";

export interface IMessageRepository {
  saveMessage(message: IMessage): Promise<IMessage>;
  getMessagesByConversationId(conversationId: string): Promise<IMessage[]>;
}