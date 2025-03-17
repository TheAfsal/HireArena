import { IMessage } from "@core/types/chat.types";
import { BaseRepository } from "./base.repository";
import { IChatRepository } from "@core/interfaces/repository/IChatRepository";
import Message from '../model/message'

export class ChatRepository extends BaseRepository<IMessage> implements IChatRepository {
  
  constructor() {
    super(Message);
  }

  async getRoomMessages(roomId: string): Promise<IMessage[]> {
    return await this.model
      .find({ roomId })
      .sort({ timestamp: 1 })
      .exec();
  }
}