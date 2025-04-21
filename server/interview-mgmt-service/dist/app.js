"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const machineTask_routes_1 = __importDefault(require("./routes/machineTask.routes"));
const aptitude_routes_1 = __importDefault(require("./routes/aptitude.routes"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        `http://${process.env.CLIENT_URL}:3000`,
        `http://${process.env.GATEWAY_URL}:4000`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
(0, db_1.connectDB)();
app.use("/api/interviews/aptitude", aptitude_routes_1.default);
app.use("/api/interviews", interview_routes_1.default);
app.use("/api/machine-task", machineTask_routes_1.default);
app.get("/health", (_, res) => {
    res.status(200).json({ status: "User Service is running!" });
    return;
});
exports.default = app;
