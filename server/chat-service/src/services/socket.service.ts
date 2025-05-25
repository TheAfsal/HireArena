import { injectable, inject } from "inversify";
import { Server, Socket } from "socket.io";
import { TYPES } from "@di/types";
import { IChatService } from "@core/interfaces/services/IChatService";
import { IMessageDTO } from "@core/types/chat.types";
import { getCompanyIdByUserId } from "@config/grpc.client";
import jwt from "jsonwebtoken";

const rooms = new Map();

@injectable()
export class SocketManager {
  private io: Server;
  private chatService: IChatService;

  constructor(@inject(TYPES.ChatService) chatService: IChatService) {
    this.chatService = chatService;
    this.io = new Server({
      cors: {
        origin: ["http://localhost:3000", "http://localhost"],
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
      console.log(`User ${socket.userId} connected`);

      socket.join(`user:${socket.userId}`);

      socket.on("joinRoom", async (roomId: string) => {
        console.log(`${socket.userId} joined room ${roomId}`);
        socket.join(roomId);

        // Mark messages as read when the user joins the room
        try {
          //@ts-ignore
          const messages = await this.chatService.markMessagesRead(roomId, socket.userId);
          const messageIds = messages.map((msg) => msg.id);
          if (messageIds.length > 0) {
            this.io.to(roomId).emit("messageRead", { conversationId: roomId, messageIds });
          }
        } catch (error) {
          console.error(error);
          socket.emit("error", "Failed to mark messages as read");
        }

        // Mark messages as delivered for online users
        try {
          const conversation = await this.chatService.getConversation(roomId);
          if (conversation) {
            const participants = conversation.participants;
            for (const participantId of participants) {
              if (participantId !== socket.userId) {
                const sockets = await this.io.in(`user:${participantId}`).fetchSockets();
                if (sockets.length > 0) {
                  const messages = await this.chatService.markMessagesDelivered(roomId, participantId);
                  const messageIds = messages.map((msg) => msg.id);
                  if (messageIds.length > 0) {
                    this.io.to(roomId).emit("messageDelivered", { conversationId: roomId, messageIds });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(error);
          socket.emit("error", "Failed to mark messages as delivered");
        }
      });

      socket.on("typing", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
        socket.to(conversationId).emit("typing", { conversationId, userId });
      });

      socket.on("stopTyping", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
        socket.to(conversationId).emit("stopTyping", { conversationId, userId });
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

            if (!socket.userId) {
              socket.emit("error", "Invalid user");
              return;
            }

            const message: IMessageDTO = {
              conversationId: roomId,
              senderId: socket.userId,
              receiverId:
                conversation.participants.find((m) => m !== socket.userId) ?? "",
              content,
            };

            const savedMessage = await this.chatService.sendMessage(message);
            this.io.to(roomId).emit("newMessage", savedMessage);

            // Notify participants and mark as delivered if online
            const participants = conversation.participants;
            for (const participantId of participants) {
              if (participantId !== socket.userId) {
                const sockets = await this.io.in(`user:${participantId}`).fetchSockets();
                this.io.to(`user:${participantId}`).emit("notification", {
                  conversationId: roomId,
                  message: savedMessage,
                  senderId: socket.userId,
                });
                if (sockets.length > 0) {
                  const messages = await this.chatService.markMessagesDelivered(roomId, participantId);
                  const messageIds = messages.map((msg) => msg.id);
                  if (messageIds.length > 0) {
                    this.io.to(roomId).emit("messageDelivered", { conversationId: roomId, messageIds });
                  }
                }
              }
            }
          } catch (error) {
            console.error(error);
            socket.emit("error", "Failed to send message");
          }
        }
      );

      socket.on(
        "messageCompany",
        async (data: { roomId: string; content: string }) => {
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
              receiverId:
                conversation.participants.find((m) => m !== socket.userId) ?? "",
              content,
            };

            const savedMessage = await this.chatService.sendMessage(message);
            this.io.to(roomId).emit("newMessage", savedMessage);

            // Notify participants and mark as delivered if online
            const participants = conversation.participants;
            for (const participantId of participants) {
              if (participantId !== socket.userId) {
                const sockets = await this.io.in(`user:${participantId}`).fetchSockets();
                this.io.to(`user:${participantId}`).emit("notification", {
                  conversationId: roomId,
                  message: savedMessage,
                  senderId: companyId,
                });
                if (sockets.length > 0) {
                  const messages = await this.chatService.markMessagesDelivered(roomId, participantId);
                  const messageIds = messages.map((msg) => msg.id);
                  if (messageIds.length > 0) {
                    this.io.to(roomId).emit("messageDelivered", { conversationId: roomId, messageIds });
                  }
                }
              }
            }
          } catch (error) {
            console.error(error);
            socket.emit("error", "Failed to send company message");
          }
        }
      );

      socket.on("markMessagesRead", async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
        try {
          const messages = await this.chatService.markMessagesRead(conversationId, userId);
          const messageIds = messages.map((msg) => msg.id);
          if (messageIds.length > 0) {
            this.io.to(conversationId).emit("messageRead", { conversationId, messageIds });
          }
        } catch (error) {
          console.error(error);
          socket.emit("error", "Failed to mark messages as read");
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

      let currentRoom = null;
      console.log("User connected:", socket.id);

      socket.on("register-peer", ({ peerId, meetingId: roomId }) => {
        console.log(`Peer ${peerId} joined room ${roomId}`);
        socket.join(roomId);
        currentRoom = roomId;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, []);
        }

        const roomPeerIds = rooms.get(roomId);
        roomPeerIds.push(peerId);
        //@ts-ignore
        socket.peerId = peerId;

        socket.emit(
          "available-peers",
          roomPeerIds.filter((id) => id !== peerId)
        );
        socket.to(roomId).emit("new-peer", peerId);
        console.log(`Room ${roomId} peers: ${roomPeerIds}`);
      });

      socket.on("disconnect", () => {
        //@ts-ignore
        if (currentRoom && socket.peerId) {
          const roomPeerIds = rooms.get(currentRoom);
          if (roomPeerIds) {
            const updatedPeerIds = roomPeerIds.filter(
              //@ts-ignore
              (id) => id !== socket.peerId
            );
            if (updatedPeerIds.length > 0) {
              rooms.set(currentRoom, updatedPeerIds);
            } else {
              rooms.delete(currentRoom);
            }
            //@ts-ignore
            socket.to(currentRoom).emit("peer-disconnected", socket.peerId);
            //@ts-ignore
            console.log(`Peer ${socket.peerId} left room ${currentRoom}`);
          }
        }
      });
    });
  }
}