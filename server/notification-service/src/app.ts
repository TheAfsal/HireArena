import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "@config/db";
import notificationRoutes from "@routes/notification.routes"

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

connectDB()

app.use(helmet());
app.use(morgan("dev"));

app.use("/api/notification", notificationRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "User Service is running!" });
  return;
});

export default app;
