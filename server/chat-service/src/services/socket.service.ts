import { injectable, inject } from "inversify";
import { Server, Socket } from "socket.io";
import { TYPES } from "di/types";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageDTO } from "@core/types/chat.types";
import { getCompanyIdByUserId } from "@config/grpc.client";
import jwt from "jsonwebtoken";

@injectable()
export class SocketManager {
  private io: Server;
  private chatService: IChatService;

  constructor(@inject(TYPES.ChatService) chatService: IChatService) {
    this.chatService = chatService;
    this.io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  public setupSocket(server: any): void {
    this.io.attach(server);

    this.io.use((socket, next) => {
        const token = socket.handshake.auth.token;
  
        if (!token) return next(new Error("Authentication error"));
  
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
            if (err) {
              return next(new Error("Invalid or expired token"));
            }
  
            if (decoded && typeof decoded === "object") {
              socket.userId = decoded.userId;
            } else {
              return next(new Error("Invalid token structure"));
            }
  
            next();
          });
        } catch (err) {
          next(new Error("Invalid token"));
        }
      });

      this.io.on("connection", (socket: Socket) => {
        console.log(`User ${socket.userId} connected`);
  
        // Join a personal room for the user to receive notifications
        socket.join(`user:${socket.userId}`);
  
        socket.on("joinRoom", (roomId: string) => {
          console.log(`${socket.userId} joined room ${roomId}`);
          socket.join(roomId);
        });
  
        socket.on("message", async (data: { roomId: string; content: string }) => {
          const { roomId, content } = data;
  
          try {
            const conversation = await this.chatService.getConversation(roomId);
            if (!conversation) {
              socket.emit("error", "Conversation not found");
              return;
            }
  
            if (!socket.userId) {
              socket.emit("error", "Invalid user");
              return;
            }
  
            const message: IMessageDTO = {
              conversationId: roomId,
              senderId: socket.userId,
              receiverId: conversation.participants.find((m) => m !== socket.userId) ?? "",
              content,
            };
  
            const savedMessage = await this.chatService.sendMessage(message);
  
            // Emit to the conversation room (for users who have joined the room)
            this.io.to(roomId).emit("newMessage", savedMessage);
  
            // Send notifications to both participants
            const participants = conversation.participants;
            participants.forEach((participantId) => {
              if (participantId !== socket.userId) {
                this.io.to(`user:${participantId}`).emit("notification", {
                  conversationId: roomId,
                  message: savedMessage,
                  senderId: socket.userId,
                });
              }
            });
          } catch (error) {
            console.error(error);
            socket.emit("error", "Failed to send message");
          }
        });
  
        socket.on("messageCompany", async (data: { roomId: string; content: string }) => {
          const { roomId, content } = data;
  
          try {
            const conversation = await this.chatService.getConversation(roomId);
            if (!conversation) {
              socket.emit("error", "Conversation not found");
              return;
            }
  
            if (!socket.userId) {
              socket.emit("error", "Invalid user");
              return;
            }
  
            const companyId = await getCompanyIdByUserId(socket.userId);
  
            const message: IMessageDTO = {
              conversationId: roomId,
              senderId: companyId,
              receiverId: conversation.participants.find((m) => m !== socket.userId) ?? "",
              content,
            };
  
            const savedMessage = await this.chatService.sendMessage(message);
  
            // Emit to the conversation room
            this.io.to(roomId).emit("newMessage", savedMessage);
  
            // Send notifications to participants
            const participants = conversation.participants;
            participants.forEach((participantId) => {
              if (participantId !== socket.userId) {
                this.io.to(`user:${participantId}`).emit("notification", {
                  conversationId: roomId,
                  message: savedMessage,
                  senderId: companyId,
                });
              }
            });
          } catch (error) {
            console.error(error);
            socket.emit("error", "Failed to send company message");
          }
        });
  
        socket.on("chatHistory", async (roomId: string) => {
          try {
            const messages = await this.chatService.getChatHistory(roomId);
            socket.emit("chatHistory", messages);
          } catch (error) {
            console.error(error);
            socket.emit("error", "Failed to fetch chat history");
          }
        });
  
        socket.on("disconnect", () => {
          console.log(`User ${socket.userId} disconnected`);
        });
    });
  }
}
