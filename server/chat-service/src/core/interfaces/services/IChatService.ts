import { IMessage } from "@core/types/chat.types";

export interface IChatService {
  saveChatMessage(
    senderId: string,
    content: string,
    roomId: string
  ): Promise<IMessage>;
  getChatHistory(roomId: string): Promise<IMessage[]>;
}
