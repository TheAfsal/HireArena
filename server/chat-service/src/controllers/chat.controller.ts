import { IChatController } from "@core/interfaces/controllers/IChatController";
import { IChatService } from "@core/interfaces/services/IChatService";
import { Server, Socket } from "socket.io";

export class ChatController implements IChatController {
  constructor(private io: Server, private chatService: IChatService) {}

  setupSocketEvents(socket: Socket) {
    socket.on("joinRoom", async (roomId: string) => {
      console.log();

      socket.join(roomId);

      const messages = await this.chatService.getChatHistory(roomId);
      socket.emit("chatHistory", messages);
    });

    socket.on("message", async ({ roomId, content, senderId }) => {
      try {
        const message = await this.chatService.saveChatMessage(
          senderId,
          content,
          roomId
        );

        this.io.to(roomId).emit("newMessage", message);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  }
}
