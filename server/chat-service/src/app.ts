import express, { Application } from "express";
import http from "http";
import container from "di/container";
import chatRoutes from "@routes/chat.routes";
import dotenv from "dotenv";
import { SocketManager } from "@services/socket.service";
import { TYPES } from "@di/types";


const app: Application = express();
const server = http.createServer(app);
dotenv.config();

const socketManager = container.get<SocketManager>(TYPES.SocketManager);
socketManager.setupSocket(server);

app.use("/api/chats", chatRoutes);

export default server;





// import client from "prom-client";
// import winston from "winston";
// import LokiTransport from "winston-loki";
// import { v4 as uuidv4 } from 'uuid';

// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics();

// const httpRequestCounter = new client.Counter({
//   name: "http_requests_total",
//   help: "Total number of HTTP requests",
//   labelNames: ["method", "route", "status_code"],
// });

// const httpRequestDuration = new client.Histogram({
//   name: "http_request_duration_seconds",
//   help: "Duration of HTTP requests in seconds",
//   labelNames: ["method", "route", "status_code"],
//   buckets: [0.1, 0.5, 1, 2, 5],
// });

// app.get("/metrics", async (req, res) => {
//   res.set("Content-Type", client.register.contentType);
//   res.end(await client.register.metrics());
// });

// export const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     winston.format.json()
//   ),
//   transports: [
//     new LokiTransport({
//       host: "http://loki:3100",
//       labels: { job: "chat-service", environment: "development" },
//       json: true,
//       replaceTimestamp: true,
//     }),
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//         winston.format((info) => {
//           const { level, ...metadata } = info;
//           return { ...info, metadata };
//         })(),
//         winston.format.printf(({ timestamp, level, message, metadata }) => {
//           return `[${timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(
//             metadata
//           )}`;
//         })
//       ),
//     }),
//   ],
// });

// app.use((req:any, res, next) => {
//   const start = Date.now();
//   const requestId = uuidv4();
//   req.requestId = requestId;

//   logger.info("Received request", {
//     requestId,
//     method: req.method,
//     path: req.path,
//     status: null,
//     duration: 0,
//     ip: req.ip,
//   });

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     const statusCode = res.statusCode;
//     const logLevel =
//       statusCode >= 500
//         ? "error"
//         : statusCode >= 400 || duration > 5000
//         ? "warn"
//         : "info";

//     httpRequestCounter.inc({
//       method: req.method,
//       route: req.path,
//       status_code: res.statusCode,
//     });
//     httpRequestDuration.observe(
//       { method: req.method, route: req.path, status_code: res.statusCode },
//       duration
//     );

//     logger[logLevel]("Completed request", {
//       requestId,
//       method: req.method,
//       path: req.path,
//       status: statusCode,
//       duration,
//       ip: req.ip,
//       userId: JSON.parse(req.headers["x-user"] as string).userId || "anonymous",
//     });
//   });

//   next();
// });