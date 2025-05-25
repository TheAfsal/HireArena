import { IMessage } from "@core/types/chat.types";
import { BaseRepository } from "./base.repository";
import { Message } from "../model/message.model";
import { IMessageRepository } from "@core/interfaces/repository/IMessageRepository";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(Message);
  }

  async saveMessage(message: IMessage): Promise<IMessage> {
    const newMessage = new Message(message);
    return await newMessage.save();
  }

  async getMessagesByConversationId(conversationId: string): Promise<IMessage[]> {
    return await Message.find({ conversationId }).sort({ timestamp: 1 }).exec();
  }

  async updateMessageStatus(messageIds: string[], status: "sent" | "delivered" | "read"): Promise<void> {
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { status } }
    ).exec();
  }

  async markMessagesAsDelivered(conversationId: string, receiverId: string): Promise<IMessage[]> {
    const messages = await Message.find({
      conversationId,
      receiverId,
      status: "sent",
    }).exec();
    const messageIds = messages.map((msg) => msg._id);
    if (messageIds.length > 0) {
      //@ts-ignore
      await this.updateMessageStatus(messageIds, "delivered");
    }
    return messages;
  }

  async markMessagesAsRead(conversationId: string, receiverId: string): Promise<IMessage[]> {
    const messages = await Message.find({
      conversationId,
      receiverId,
      status: { $in: ["sent", "delivered"] },
    }).exec();
    const messageIds = messages.map((msg) => msg._id);
    if (messageIds.length > 0) {
      //@ts-ignore
      await this.updateMessageStatus(messageIds, "read");
    }
    return messages;
  }

  async getMessageStatuses(conversationId: string, userId: string): Promise<IMessage[]> {
    return await Message.find({
      conversationId,
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).select("id status").exec();
  }
}