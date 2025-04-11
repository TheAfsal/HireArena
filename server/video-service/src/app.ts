// import express from "express";
// import http from "http";
// import { Server as SocketServer, Socket } from "socket.io";
// import { TYPES } from "./di/types";
// import container from "di/container";
// import { VideoCallService } from "@services/videoCall.service";
// import { connectDB } from "@config/db";

// const app = express();
// const httpServer = http.createServer(app);
// const io = new SocketServer(httpServer, { cors: { origin: "*" } });

// const videoCallService = container.get<VideoCallService>(
//   TYPES.VideoCallService
// );

// // Socket.IO Events
// io.on("connection", (socket: Socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinCall", (conversationId: string) => {
//     socket.join(conversationId);
//     console.log(
//       `${socket.data.userId || socket.id} joined call ${conversationId}`
//     );
//   });

//   socket.on(
//     "startVideoCall",
//     async ({
//       conversationId,
//       participants,
//     }: {
//       conversationId: string;
//       participants: string[];
//     }) => {
//       try {
//         const call = await videoCallService.startVideoCall(
//           conversationId,
//           participants
//         );
//         io.to(conversationId).emit("videoCallStarted", {
//           conversationId: call.conversationId,
//           participants,
//         });
//         console.log(`Video call started for ${conversationId}`);
//       } catch (error) {
//         socket.emit("error", (error as Error).message);
//         console.error(
//           `Error starting video call for ${conversationId}:`,
//           error
//         );
//       }
//     }
//   );

//   socket.on("getVideoCall", async (conversationId: string) => {
//     const call = await videoCallService.getVideoCall(conversationId);
//     if (call) {
//       socket.emit("videoCallDetails", call);
//     } else {
//       socket.emit("error", "Video call not found");
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// const startServer = async () => {
//   await connectDB();
//   httpServer.listen(5013, () => {
//     console.log("Video-service running on port 5013");
//   });
// };

// startServer();