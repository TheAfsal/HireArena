import { IMessage } from "@core/types/chat.types";
import { BaseRepository } from "./base.repository";
import { Message } from "../model/message";
import { IMessageRepository } from "@core/interfaces/repository/IMessageRepository";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(Message);
  }

  async saveMessage(message: IMessage): Promise<IMessage> {
    return await this.create(message);
  }

  async getMessagesByConversationId(
    conversationId: string
  ): Promise<IMessage[]> {
    return await Message.find({ conversationId }).sort({ timestamp: 1 }).exec();
  }
}
