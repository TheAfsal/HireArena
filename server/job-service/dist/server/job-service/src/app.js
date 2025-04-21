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
require("./config/prismaClient");
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const jobCategoryRoutes_1 = __importDefault(require("./routes/jobCategoryRoutes"));
const skillRoutes_1 = __importDefault(require("./routes/skillRoutes"));
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
app.use("/api/jobs", jobRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/job-categories", jobCategoryRoutes_1.default);
app.use("/api/skills", skillRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "User Service is running!" });
    return;
});
exports.default = app;
