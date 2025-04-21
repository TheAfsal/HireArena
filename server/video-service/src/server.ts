import express from "express";
import http from "http";
import { Server as SocketServer, Socket } from "socket.io";
// import { TYPES } from "./di/types";
// import container from "di/container";
// import { VideoCallService } from "@services/videoCall.service";
import { connectDB } from "@config/db";
import jwt from "jsonwebtoken";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, { cors: { origin: "*" } });

const rooms = new Map();

// const videoCallService = container.get<VideoCallService>(
//   TYPES.VideoCallService
// );

io.use((socket, next) => {
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

// Socket.IO Events
io.on("connection", (socket: Socket) => {
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

    socket.emit("available-peers", roomPeerIds.filter((id) => id !== peerId));
    socket.to(roomId).emit("new-peer", peerId);
    console.log(`Room ${roomId} peers: ${roomPeerIds}`);
  });

  socket.on("disconnect", () => {
    //@ts-ignore
    if (currentRoom && socket.peerId) {
      const roomPeerIds = rooms.get(currentRoom);
      if (roomPeerIds) {
        //@ts-ignore
        const updatedPeerIds = roomPeerIds.filter((id) => id !== socket.peerId);
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

  // socket.on(
  //   "startVideoCall",
  //   async ({ conversationId }: { conversationId: string }) => {
  //     try {
  //       const participants = [
  //         "d536c55f-0426-4281-bc3c-45c35e8b72da",
  //         "84ff3281-fbc3-4062-a6b2-ba5cc5296adb",
  //       ];
  //       // const call = await videoCallService.startVideoCall(
  //       //   conversationId,
  //       //   participants
  //       // );
  //       io.to(conversationId).emit("videoCallStarted", {
  //         conversationId: "call.conversationId",
  //         participants,
  //       });
  //       console.log(`Video call started for ${conversationId}`);
  //     } catch (error) {
  //       socket.emit("error", (error as Error).message);
  //       console.error(
  //         `Error starting video call for ${conversationId}:`,
  //         error
  //       );
  //     }
  //   }
  // );

  // socket.on("getVideoCall", async (conversationId: string) => {
  //   const call = await videoCallService.getVideoCall(conversationId);
  //   if (call) {
  //     socket.emit("videoCallDetails", call);
  //   } else {
  //     socket.emit("error", "Video call not found");
  //   }
  // });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  // });
// });

const startServer =  () => {
  httpServer.listen(5013, async() => {
    await connectDB();
    console.log("video-service running on port 5013");
  });
};

startServer();
