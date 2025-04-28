import express, { Application,Request } from "express";
import http from "http";
import container from "di/container";
import chatRoutes from "@routes/chat.routes";
import dotenv from "dotenv";
import { SocketManager } from "@services/socket.service";
import { TYPES } from "@di/types";
import client from "prom-client";
import winston from "winston";
import LokiTransport from "winston-loki";
import { v4 as uuidv4 } from 'uuid';


const app: Application = express();
const server = http.createServer(app);
dotenv.config();
const socketManager = container.get<SocketManager>(TYPES.SocketManager);
socketManager.setupSocket(server);

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
  transports: [
    new LokiTransport({
      host: "http://loki:3100",
      labels: { job: "chat-service", environment: "development" },
      json: true,
      replaceTimestamp: true,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format((info) => {
          const { level, ...metadata } = info;
          return { ...info, metadata };
        })(),
        winston.format.printf(({ timestamp, level, message, metadata }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(
            metadata
          )}`;
        })
      ),
    }),
  ],
});

app.use((req:any, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();
  req.requestId = requestId;

  logger.info("Received request", {
    requestId,
    method: req.method,
    path: req.path,
    status: null,
    duration: 0,
    ip: req.ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logLevel =
      statusCode >= 500
        ? "error"
        : statusCode >= 400 || duration > 5000
        ? "warn"
        : "info";

    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    httpRequestDuration.observe(
      { method: req.method, route: req.path, status_code: res.statusCode },
      duration
    );

    logger[logLevel]("Completed request", {
      requestId,
      method: req.method,
      path: req.path,
      status: statusCode,
      duration,
      ip: req.ip,
      userId: JSON.parse(req.headers["x-user"] as string).userId || "anonymous",
    });
  });

  next();
});

app.use("/api/chats", chatRoutes);

export default server;

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
// io.on("connection", (socket) => {
//   console.log("New user connected: ----------------------------------------------", socket.id);
//   chatController.registerEvents(socket);
// });
