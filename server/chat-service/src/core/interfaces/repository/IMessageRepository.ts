import { IMessage } from "@core/types/chat.types";

export interface IMessageRepository {
  saveMessage(message: IMessage): Promise<IMessage>;
  getMessagesByConversationId(conversationId: string): Promise<IMessage[]>;
  updateMessageStatus(
    messageIds: string[],
    status: "sent" | "delivered" | "read"
  ): Promise<void>;
  markMessagesAsRead(
    conversationId: string,
    receiverId: string
  ): Promise<IMessage[]>
  markMessagesAsDelivered(
    conversationId: string,
    receiverId: string
  ): Promise<IMessage[]>
  getMessageStatuses(conversationId: string, userId: string): Promise<IMessage[]>
}
