"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const inversify_1 = require("inversify");
const socket_io_1 = require("socket.io");
const types_1 = require("../di/types");
const grpc_client_1 = require("../config/grpc.client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let SocketManager = class SocketManager {
    constructor(chatService) {
        this.chatService = chatService;
        this.io = new socket_io_1.Server({
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
    }
    setupSocket(server) {
        this.io.attach(server);
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token)
                return next(new Error("Authentication error"));
            try {
                jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        return next(new Error("Invalid or expired token"));
                    }
                    if (decoded && typeof decoded === "object") {
                        socket.userId = decoded.userId;
                    }
                    else {
                        return next(new Error("Invalid token structure"));
                    }
                    next();
                });
            }
            catch (err) {
                next(new Error("Invalid token"));
            }
        });
        this.io.on("connection", (socket) => {
            console.log(`User ${socket.userId} connected`);
            // Join a personal room for the user to receive notifications
            socket.join(`user:${socket.userId}`);
            socket.on("joinRoom", (roomId) => {
                console.log(`${socket.userId} joined room ${roomId}`);
                socket.join(roomId);
            });
            socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { roomId, content } = data;
                try {
                    const conversation = yield this.chatService.getConversation(roomId);
                    if (!conversation) {
                        socket.emit("error", "Conversation not found");
                        return;
                    }
                    if (!socket.userId) {
                        socket.emit("error", "Invalid user");
                        return;
                    }
                    const message = {
                        conversationId: roomId,
                        senderId: socket.userId,
                        receiverId: (_a = conversation.participants.find((m) => m !== socket.userId)) !== null && _a !== void 0 ? _a : "",
                        content,
                    };
                    const savedMessage = yield this.chatService.sendMessage(message);
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
                }
                catch (error) {
                    console.error(error);
                    socket.emit("error", "Failed to send message");
                }
            }));
            socket.on("messageCompany", (data) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { roomId, content } = data;
                try {
                    const conversation = yield this.chatService.getConversation(roomId);
                    if (!conversation) {
                        socket.emit("error", "Conversation not found");
                        return;
                    }
                    if (!socket.userId) {
                        socket.emit("error", "Invalid user");
                        return;
                    }
                    const companyId = yield (0, grpc_client_1.getCompanyIdByUserId)(socket.userId);
                    const message = {
                        conversationId: roomId,
                        senderId: companyId,
                        receiverId: (_a = conversation.participants.find((m) => m !== socket.userId)) !== null && _a !== void 0 ? _a : "",
                        content,
                    };
                    const savedMessage = yield this.chatService.sendMessage(message);
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
                }
                catch (error) {
                    console.error(error);
                    socket.emit("error", "Failed to send company message");
                }
            }));
            socket.on("chatHistory", (roomId) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const messages = yield this.chatService.getChatHistory(roomId);
                    socket.emit("chatHistory", messages);
                }
                catch (error) {
                    console.error(error);
                    socket.emit("error", "Failed to fetch chat history");
                }
            }));
            socket.on("disconnect", () => {
                console.log(`User ${socket.userId} disconnected`);
            });
        });
    }
};
exports.SocketManager = SocketManager;
exports.SocketManager = SocketManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ChatService)),
    __metadata("design:paramtypes", [Object])
], SocketManager);
