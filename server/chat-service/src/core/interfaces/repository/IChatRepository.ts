import { IMessage } from "@core/types/chat.types";

export interface IChatRepository {
//   saveMessage(message: IMessage): Promise<IMessage>;
  getRoomMessages(roomId: string): Promise<IMessage[]>;
}
