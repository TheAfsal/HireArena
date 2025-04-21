"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const container_1 = __importDefault(require("./di/container"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const types_1 = require("./di/types");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const socketManager = container_1.default.get(types_1.TYPES.SocketManager);
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
app.use("/api/chats", chat_routes_1.default);
// io.on("connection", (socket) => {
//   console.log("New user connected: ----------------------------------------------", socket.id);
//   chatController.registerEvents(socket);
// });
exports.default = server;
