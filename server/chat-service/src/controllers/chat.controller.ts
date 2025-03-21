import { Request, Response } from "express";
import { IChatController } from "@core/interfaces/controllers/IChatController";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageDTO } from "@core/types/chat.types"; 
import { IUser } from "@core/types/IUser";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.SocketIOServer) private io: Server,@inject(TYPES.ChatService)  private chatService: IChatService) {}

  public registerEvents(socket: Socket) {
    socket.on("joinRoom", (roomId: string) => {
      console.log(roomId + " joined");
      console.log("socket.id : ",socket.id);
      
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

  getUserConversations = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
      ? JSON.parse(req.headers["x-user"] as string)
      : null;
  
      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return 
      }
  
      const conversations = await this.chatService.getUserConversations(userId);
      res.status(200).json(conversations);
      return 
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return
    }
  };
  
}