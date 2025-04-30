import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import client from "prom-client";
import winston from "winston";
import LokiTransport from "winston-loki";
import { v4 as uuidv4 } from "uuid";
import { validateAccessToken } from "./middleware/validateToken";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const socketIoProxy = createProxyMiddleware({
  target: "http://chat-service:5009",
  ws: true,
  changeOrigin: true,
  on: {
    proxyReqWs: (proxyReq, req) => {
      //@ts-ignore
      if (req.user) {
        //@ts-ignore
        proxyReq.setHeader("x-user", JSON.stringify(req.user));
      }
    },
  },
});

app.use(helmet());
app.use(morgan("dev"));

// performance & logging
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

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json() // For Loki
  ),
  transports: [
    new LokiTransport({
      host: "http://loki:3100",
      labels: { job: "gateway-service", environment: "development" },
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

// app.use((req, res, next) => {
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
//       userId: req.user?.userId || "anonymous",
//     });
//   });

//   next();
// });

// app.get("/health", (req: Request, res: Response) => {
//   res.status(200).json({ status: "Gateway Service is up and running!" });
// });


const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: `http://${process.env.USER_SERVER_URL}:5000`,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req: Request, res: Response) => {
      if (req.user) {
        proxyReq.setHeader("x-user", JSON.stringify(req.user));
      }
    },
  },
});

app.use(
  "/user-service/auth",
  (req, res, next) => {
    console.log(`http://${process.env.USER_SERVER_URL}:5000`);
    next();
  },
  proxyMiddleware
);

app.use("/user-service/", validateAccessToken, proxyMiddleware);

app.use(
  "/job-service/",
  validateAccessToken,
  createProxyMiddleware({
    target: `http://${process.env.JOB_SERVER_URL}:5002`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req: Request, res: Response) => {
        if (req.user) {
          proxyReq.setHeader("x-user", JSON.stringify(req.user));
        }
      },
    },
  })
);

app.use(
  "/admin-service/",
  // validateAccessToken,
  createProxyMiddleware({
    target: `http://${process.env.ADMIN_SERVER_URL}:5003`,
    changeOrigin: true,
  })
);

app.use(
  "/interview-mgmt-service/",
  validateAccessToken,
  createProxyMiddleware({
    target: `http://${process.env.INTERVIEW_SERVER_URL}:5006`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req: Request, res: Response) => {
        if (req.user) {
          proxyReq.setHeader("x-user", JSON.stringify(req.user));
        }
      },
    },
  })
);

app.use(
  "/chat-service/",
  validateAccessToken,
  createProxyMiddleware({
    target: `http://${process.env.CHAT_SERVER_URL}:5009`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req: Request, res: Response) => {
        if (req.user) {
          proxyReq.setHeader("x-user", JSON.stringify(req.user));
        }
      },
    },
  })
);

app.use( socketIoProxy);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // logger.log("Error from gateway service --> ", err);
  console.log("Error from gateway service --> ", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

export default app;











//
// app.use(
//   "/socket.io",
//   createProxyMiddleware({
//     target: "http://chat-service:5009",
//     changeOrigin: true,
//     ws: true,
//   })
// );

// app.use(
//   "/chat",
//   createProxyMiddleware({
//     target: "http://chat-service:5009",
//     changeOrigin: true,
//     ws: true,
//     pathRewrite: { "^/chat": "" },
//   })
// );