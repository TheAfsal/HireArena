import { IBaseRepository } from "@core/interfaces/repository/IBaseRepository";
import { IChatRepository } from "@core/interfaces/repository/IChatRepository";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessage } from "@core/types/chat.types";

export class ChatService implements IChatService {
  constructor(private chatRepository: IChatRepository & IBaseRepository<IMessage>) {}

  async saveChatMessage(
    senderId: string,
    content: string,
    roomId: string
  ): Promise<IMessage> {
    const messageData = {
      senderId,
      content,
      roomId,
      timestamp: new Date(),
    };
    return this.chatRepository.create(messageData);
  }

  async getChatHistory(roomId: string): Promise<IMessage[]> {
    return this.chatRepository.getRoomMessages(roomId);
  }
}
