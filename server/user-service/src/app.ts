import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "@routes/authRoutes";
import companyRoutes from "@routes/companyRoutes";
import jobSeekerRoutes from "@routes/jobSeekerRoutes";
import adminRoutes from "@routes/adminRoutes";
import subscriptionRoutes from "@routes/subscriptionRoutes";
import webhookRoutes from "@routes/webhookRoutes";
import jwt from "jsonwebtoken";
import client from "prom-client";
import winston from "winston";
import LokiTransport from "winston-loki";
import { v4 as uuidv4 } from 'uuid';

//
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import "../src/utils/passport";
import JobSeekerRepository from "@repositories/JobSeekerRepository";
import AdminRepository from "@repositories/AdminRepository";
import CompanyRepository from "@repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "@repositories/CompanyEmployeeRepository";
import prisma from "@config/prismaClient";
import EmployeeRepository from "@repositories/EmployeeRepository";
import RedisService from "@services/RedisServices";
import PasswordService from "@services/PasswordServices";
import TokenService from "@services/TokenServices";
import EmailService from "@services/EmailServices";
import InvitationRepository from "@repositories/InvitationRepository";
import AuthService from "@services/AuthService";
dotenv.config();

// import stripeLib from "stripe";
// const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY || "");

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "your_random_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

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

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json() 
  ),
  transports: [
    new LokiTransport({
      host: 'http://loki:3100',
      labels: { job: 'user-service', environment: 'development' },
      json: true,
      replaceTimestamp: true,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format((info) => {
          const { level, ...metadata } = info;
          return { ...info, metadata };
        })(),
        winston.format.printf(({ timestamp, level, message, metadata }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(metadata)}`;
        })
      ),
    }),
  ],
});

app.use((req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();
  req.requestId = requestId;

  logger.info('Received request', {
    requestId,
    method: req.method,
    path: req.path,
    status: null,
    duration: 0,
    ip: req.ip,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logLevel = statusCode >= 500 ? 'error' : (statusCode >= 400 || duration > 5000) ? 'warn' : 'info';

    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
    httpRequestDuration.observe(
      { method: req.method, route: req.path, status_code: res.statusCode },
      duration
    );

    logger[logLevel]('Completed request', {
      requestId,
      method: req.method,
      path: req.path,
      status: statusCode,
      duration,
      ip: req.ip,
      userId: JSON.parse(req.headers["x-user"] as string).userId || 'anonymous', 
    });
  });

  next();
});


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// const YOUR_DOMAIN = "http://localhost:3000";

// // Create Checkout Session endpoint
// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "T-shirt",
//             },
//             unit_amount: 2000,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${YOUR_DOMAIN}/cancel`,
//     });

//     console.log("session.url--->", session);

//     // res.redirect(303, session.url || "");
//     res.json({ sessionUrl:session.url });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).send("Server error");
//   }
// });

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

interface GoogleUser {
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),

  async (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:3000/login");
    }

    //@ts-ignore
    const userProfile = req.user as GoogleUser | null;

    if (!userProfile) {
      return res.redirect("http://localhost:3000/login");
    }

    const email = userProfile.emails[0].value;
    const name = userProfile.displayName;

    const jobSeekerRepository = new JobSeekerRepository(prisma);
    const adminRepository = new AdminRepository(prisma);
    const companyRepository = new CompanyRepository(prisma);
    const employeeRepository = new EmployeeRepository(prisma);
    const redisService = new RedisService();
    const passwordService = new PasswordService();
    const tokenService = new TokenService();
    const emailService = new EmailService();

    const authService = new AuthService(
      jobSeekerRepository,
      adminRepository,
      companyRepository,
      employeeRepository,
      redisService,
      emailService,
      passwordService,
      tokenService
    );

    const user = await authService.googleLogin({
      email,
      name,
      password: "123123",
    });

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "100m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: "HR" },
      process.env.REFRESH_TOKEN_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:3000/google-login?token=${accessToken}`);
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("refreshToken");
    res.redirect("/");
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job-seeker", jobSeekerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/webhooks", webhookRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "User Service is running!" });
  return;
});

export default app;
