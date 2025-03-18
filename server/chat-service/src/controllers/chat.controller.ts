import { IChatController } from "@core/interfaces/controllers/IChatController";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageDTO } from "@core/types/chat.types"; 
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.SocketIOServer) private io: Server,@inject(TYPES.ChatService)  private chatService: IChatService) {}

  public registerEvents(socket: Socket) {
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`${socket.data.userId} joined room ${roomId}`);
    });

    socket.on("message", async (data: { roomId: string; content: string }) => {
      const { roomId, content } = data;
      const senderId = socket.data.userId;

      const conversation = await this.chatService.getChatHistory(roomId);
      if (!conversation) {
        socket.emit("error", "Conversation not found");
        return;
      }

      const message: IMessageDTO = {
        conversationId: roomId,
        senderId,
        receiverId: conversation.find((m) => m.senderId !== senderId)?.receiverId || "",
        content,
      };

      const savedMessage = await this.chatService.sendMessage(message);
      this.io.to(roomId).emit("newMessage", savedMessage);
    });

    socket.on("chatHistory", async (roomId: string) => {
      const messages = await this.chatService.getChatHistory(roomId);
      socket.emit("chatHistory", messages);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.data.userId} disconnected`);
    });
  }
}