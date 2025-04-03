import { injectable, inject } from "inversify";
import { Server, Socket } from "socket.io";
import { TYPES } from "di/types";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageDTO } from "@core/types/video.types";
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
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
          (err, decoded) => {
            if (err) {
              return next(new Error("Invalid or expired token"));
            }

            if (decoded && typeof decoded === "object") {
              socket.userId = decoded.userId;
            } else {
              return next(new Error("Invalid token structure"));
            }

            next();
          }
        );
      } catch (err) {
        next(new Error("Invalid token"));
      }
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(
        "A user connected -        - - -  -------- -         ",
        socket.id
      );

      socket.on("joinRoom", (roomId: string) => {
        console.log(roomId + " joined");
        console.log("socket.id : ", socket.id);

        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
      });

      socket.on(
        "message",
        async (data: { roomId: string; content: string }) => {
          const { roomId, content } = data;

          try {
            const conversation = await this.chatService.getConversation(roomId);

            if (!conversation) {
              socket.emit("error", "Conversation not found");
              return;
            }

            if (!socket.userId) return socket.emit("error", "Invalid user");

            const message: IMessageDTO = {
              conversationId: roomId,
              senderId: socket.userId,
              receiverId:
                conversation.participants.find((m) => m !== socket.userId) ??
                "",
              content,
            };

            const savedMessage = await this.chatService.sendMessage(message);
            console.log(savedMessage);
            console.log(this.io);
            this.io.to(roomId).emit("newMessage", savedMessage, (response) => {
              console.log(response);

              if (response === "success") {
                console.log("Message was successfully sent to the room");
              } else {
                console.error("Failed to send message to the room");
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      );

      socket.on(
        "messageCompany",
        async (data: { roomId: string; content: string }) => {
          const { roomId, content } = data;

          const conversation = await this.chatService.getConversation(roomId);
          if (!conversation) {
            socket.emit("error", "Conversation not found");
            return;
          }

          if (!socket.userId) return socket.emit("error", "Invalid user");

          const companyId = await getCompanyIdByUserId(socket.userId);

          const message: IMessageDTO = {
            conversationId: roomId,
            senderId: companyId,
            receiverId:
              conversation.participants.find((m) => m !== socket.userId) ?? "",
            content,
          };

          const savedMessage = await this.chatService.sendMessage(message);
          console.log(roomId);
          this.io.to(roomId).emit("newMessage", savedMessage);
        }
      );

      socket.on("chatHistory", async (roomId: string) => {
        const messages = await this.chatService.getChatHistory(roomId);
        socket.emit("chatHistory", messages);
      });

      socket.on("disconnect", () => {
        console.log(`${socket.data.userId} disconnected`);
      });
    });
  }
}
