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

  async updateMessageStatus(messageId: string, status: "sent" | "delivered" | "read"): Promise<void> {
    await Message.updateOne({ id: messageId }, { $set: { status } });
  }
}
