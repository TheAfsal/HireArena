import { Request, Response } from "express";
import { IChatController } from "@core/interfaces/controllers/IChatController";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageDTO } from "@core/types/chat.types";
import { IUser } from "@core/types/IUser";
import { TYPES } from "@di/types";
import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";
import { getCompanyIdByUserId } from "@config/grpc.client";
import { StatusCodes } from "http-status-codes";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject(TYPES.ChatService) private chatService: IChatService
  ) {}

  // public registerEvents(socket: Socket) {
  //   socket.on("joinRoom", (roomId: string) => {
  //     console.log(roomId + " joined");
  //     console.log("socket.id : ", socket.id);

  //     socket.join(roomId);
  //     console.log(`${socket.id} joined room ${roomId}`);
  //   });

  //   socket.on("message", async (data: { roomId: string; content: string }) => {
  //     const { roomId, content } = data;

  //     const conversation = await this.chatService.getConversation(roomId);
  //     if (!conversation) {
  //       socket.emit("error", "Conversation not found");
  //       return;
  //     }

  //     if(!socket.userId) return socket.emit("error", "Invalid user");

  //     const message: IMessageDTO = {
  //       conversationId: roomId,
  //       senderId:socket.userId,
  //       receiverId: conversation.participants.find((m) => m !== socket.userId)??"",
  //       content,
  //     };

  //     const savedMessage = await this.chatService.sendMessage(message);
  //     console.log(savedMessage);
  //     console.log(this.io);
  //     this.io.to(roomId).emit("newMessage", savedMessage, (response) => {
  //       console.log(response);

  //       if (response === "success") {
  //         console.log("Message was successfully sent to the room");
  //       } else {
  //         console.error("Failed to send message to the room");
  //       }

  //     });
  //   });

  //   socket.on("messageCompany", async (data: { roomId: string; content: string }) => {
  //     const { roomId, content } = data;

  //     const conversation = await this.chatService.getConversation(roomId);
  //     if (!conversation) {
  //       socket.emit("error", "Conversation not found");
  //       return;
  //     }

  //     if(!socket.userId) return socket.emit("error", "Invalid user");

  //     const companyId = await getCompanyIdByUserId(socket.userId)

  //     const message: IMessageDTO = {
  //       conversationId: roomId,
  //       senderId:companyId,
  //       receiverId: conversation.participants.find((m) => m !== socket.userId)??"",
  //       content,
  //     };

  //     const savedMessage = await this.chatService.sendMessage(message);
  //     console.log(roomId);
  //     this.io.to(roomId).emit("newMessage", savedMessage);
  //   });

  //   socket.on("chatHistory", async (roomId: string) => {
  //     const messages = await this.chatService.getChatHistory(roomId);
  //     socket.emit("chatHistory", messages);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log(`${socket.data.userId} disconnected`);
  //   });
  // }

  getUserConversations = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        return;
      }

      const conversations = await this.chatService.getUserConversations(userId);
      res.status(StatusCodes.OK).json({ conversations, userId });
      return;
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  getUserConversationsCompany = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        return;
      }

      const companyId = await getCompanyIdByUserId(userId);

      if (!companyId) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Company ID is required" });
        return;
      }

      const conversations = await this.chatService.getUserConversations(
        companyId
      );
      res.status(StatusCodes.OK).json({ conversations, companyId });
      return;
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };
}
