import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication token required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string };
    socket.data.userId = decoded.userId; 
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};