import { IMessage } from "@core/types/video.types";

export interface IMessageRepository {
  saveMessage(message: IMessage): Promise<IMessage>;
  getMessagesByConversationId(conversationId: string): Promise<IMessage[]>;
}
