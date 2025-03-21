import 'reflect-metadata';
import express, { Application } from "express";
import { Server } from "socket.io";
import http from "http";
import { IChatController } from '@core/interfaces/controllers/IChatController';
import container from 'di/container';
import { TYPES } from 'di/types';
import chatRoutes from '@routes/chat.routes';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const chatController = container.get<IChatController>(TYPES.ChatController);

app.use("/api/jobs", chatRoutes);

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  chatController.registerEvents(socket);
});

export default server;
