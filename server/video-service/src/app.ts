import "reflect-metadata";
import express, { Application } from "express";
import { Server } from "socket.io";
import http from "http";
import { IChatController } from "@core/interfaces/controllers/IVideoController";
import { TYPES } from "di/types";
import jwt from "jsonwebtoken";
import container from "di/container";
import videoRoutes from "@routes/video.routes";
import { SocketManager } from "@services/socket.service";

const app: Application = express();
const server = http.createServer(app);

const socketManager = container.get<SocketManager>(TYPES.SocketManager);
socketManager.setupSocket(server);

app.use("/api/video-service", videoRoutes);

export default server;
