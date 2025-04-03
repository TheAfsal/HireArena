import "reflect-metadata";
import express, { Application } from "express";
import { Server } from "socket.io";
import http from "http";
import { IChatController } from "@core/interfaces/controllers/IChatController";
import { TYPES } from "di/types";
import jwt from "jsonwebtoken";
import container from "di/container";
import chatRoutes from "@routes/chat.routes";
import { SocketManager } from "@services/socket.service";

const app: Application = express();
const server = http.createServer(app);

const socketManager = container.get<SocketManager>(TYPES.SocketManager);
socketManager.setupSocket(server);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// const chatController = container.get<IChatController>(TYPES.ChatController);


// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Authentication error"));

//   try {
//     jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET as string,
//       (err, decoded) => {
//         if (err) {
//           return next(new Error("Invalid or expired token"));
//         }

//         if (decoded && typeof decoded === "object") {
//           socket.userId = decoded.userId;
//         } else {
//           return next(new Error("Invalid token structure"));
//         }

//         next();
//       }
//     );
//   } catch (err) {
//     next(new Error("Invalid token"));
//   }
// });

app.use("/api/chats", chatRoutes);


// io.on("connection", (socket) => {
//   console.log("New user connected: ----------------------------------------------", socket.id);
//   chatController.registerEvents(socket);
// });

export default server;
