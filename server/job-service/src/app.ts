import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "./config/prismaClient";
import jobRoutes from "./routes/jobRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import jobCategoryRoutes from "./routes/jobCategoryRoutes";
import skillRoutes from "./routes/skillRoutes";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      `http://${process.env.CLIENT_URL}:3000`,
      `http://${process.env.GATEWAY_URL}:4000`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/jobs", jobRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/job-categories", jobCategoryRoutes);
app.use("/api/skills", skillRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "User Service is running!" });
  return;
});

export default app;
