import express, { Application } from "express";
import { Server } from "socket.io";
import http from "http";
import { ChatRepository } from "./repositories/chat.repository";
import { connectDB } from "./config/db";
import { ChatController } from "@controllers/chat.controller";
import { ChatService } from "@services/chat.service";

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(io, chatService);

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  chatController.setupSocketEvents(socket);
});

export default server;
