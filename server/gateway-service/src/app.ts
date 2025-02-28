import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

import { validateAccessToken } from "./middleware/validateToken";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: `http://${process.env.CLIENT_URL}:3000`,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "Gateway Service is up and running!" });
});

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
    console.log(process.env.USER_SERVER_URL);
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
    on: {
      // proxyReq: (proxyReq, req, res) => {
      //   if (req.user) {
      //     proxyReq.setHeader("x-user", JSON.stringify(req.user));
      //   }
      // },
    },
  })
);

// app.use(
//   '/user-service',
//   validateAccessToken,
//   createProxyMiddleware({
//     target: process.env.USER_SERVICE_URL || 'http://localhost:5000',
//     changeOrigin: true,
//     on: {
//       // Intercept the proxy request and modify the request headers
//       proxyReq: (proxyReq, req, res) => {
//         console.log("!!!!!!!!");
//         console.log(req.user);

//         if (req.user) {
//           // Pass `req.user` in the headers
//           proxyReq.setHeader('x-user', JSON.stringify(req.user));
//         }
//       },

//       // Intercept the proxy response
//       proxyRes: (proxyRes, req, res) => {
//         // You can modify the response headers if needed
//         console.log(`Proxy Response Headers: `, proxyRes.headers);
//         // Example: Modify response headers before passing to the client
//         proxyRes.headers['x-modified'] = 'true';
//       },

//       // Error handling event
//       // error: (err, req, res) => {
//       //   console.error('Proxy Error:', err);
//       //   res.status(500).json({ error: 'Proxy error occurred', message: err.message });
//       // },
//     },
//   })
// );

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error from gateway service --> ",err);

  console.error("Error:", err.message);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

export default app;
