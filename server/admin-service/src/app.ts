import 'reflect-metadata';
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import adminRoutes from "@routes/admin.routes";
import subscriptionRoutes from "@routes/subscription.routes";

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

app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/admin", adminRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "User Service is running!" });
  return;
});

export default app;
