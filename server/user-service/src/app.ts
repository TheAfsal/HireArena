import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "./config/prismaClient";
import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import jobSeekerRoutes from "./routes/jobSeeker";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job-seeker", jobSeekerRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "User Service is running!" });
  return;
});

export default app;
