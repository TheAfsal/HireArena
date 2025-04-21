"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
const validateToken_1 = require("./middleware/validateToken");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Gateway Service is up and running!" });
});
const proxyMiddleware = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: `http://${process.env.USER_SERVER_URL}:5000`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            if (req.user) {
                proxyReq.setHeader("x-user", JSON.stringify(req.user));
            }
        },
    },
});
app.use("/user-service/auth", (req, res, next) => {
    console.log(`http://${process.env.USER_SERVER_URL}:5000`);
    next();
}, proxyMiddleware);
app.use("/user-service/", validateToken_1.validateAccessToken, proxyMiddleware);
app.use("/job-service/", validateToken_1.validateAccessToken, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: `http://${process.env.JOB_SERVER_URL}:5002`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            if (req.user) {
                proxyReq.setHeader("x-user", JSON.stringify(req.user));
            }
        },
    },
}));
app.use("/admin-service/", 
// validateAccessToken,
(0, http_proxy_middleware_1.createProxyMiddleware)({
    target: `http://${process.env.ADMIN_SERVER_URL}:5003`,
    changeOrigin: true,
    on: {
    // proxyReq: (proxyReq, req, res) => {
    //   if (req.user) {
    //     proxyReq.setHeader("x-user", JSON.stringify(req.user));
    //   }
    // },
    },
}));
app.use("/interview-mgmt-service/", validateToken_1.validateAccessToken, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: `http://${process.env.INTERVIEW_SERVER_URL}:5006`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            if (req.user) {
                proxyReq.setHeader("x-user", JSON.stringify(req.user));
            }
        },
    },
}));
app.use("/chat-service/", validateToken_1.validateAccessToken, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: `http://${process.env.CHAT_SERVER_URL}:5009`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            if (req.user) {
                proxyReq.setHeader("x-user", JSON.stringify(req.user));
            }
        },
    },
}));
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
app.use((err, req, res, next) => {
    console.log("Error from gateway service --> ", err);
    console.error("Error:", err.message);
    res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
});
exports.default = app;
