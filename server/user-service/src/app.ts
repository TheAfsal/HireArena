import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "./config/prismaClient";
import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import jobSeekerRoutes from "./routes/jobSeekerRoutes";
import adminRoutes from "./routes/adminRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import jwt from "jsonwebtoken";

//
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import "../src/utils/passport";
import JobSeekerRepository from "./repositories/JobSeekerRepository";
import AdminRepository from "./repositories/AdminRepository";
import CompanyRepository from "./repositories/CompanyRepository";
import CompanyEmployeeRoleRepository from "./repositories/CompanyEmployeeRepository";
import prisma from "./config/prismaClient";
import EmployeeRepository from "./repositories/EmployeeRepository";
import RedisService from "./services/RedisServices";
import PasswordService from "./services/PasswordServices";
import TokenService from "./services/TokenServices";
import EmailService from "./services/EmailServices";
import InvitationRepository from "./repositories/InvitationRepository";
import AuthService from "./services/AuthService";
// import stripeLib from "stripe";
dotenv.config();
// const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY || "");

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.COOKIE_SECRET || "default_secret"],
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//     secure: false, // Set true in production with HTTPS
//     httpOnly: true, // Prevent XSS attacks
//   })
// );
app.use(
  session({
    secret: "your_random_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
    const companyEmployeeRoleRepository = new CompanyEmployeeRoleRepository(
      prisma
    );
    const employeeRepository = new EmployeeRepository(prisma);
    const redisService = new RedisService();
    const passwordService = new PasswordService();
    const tokenService = new TokenService();
    const emailService = new EmailService();
    const invitationRepository = new InvitationRepository(prisma);

    const authService = new AuthService(
      jobSeekerRepository,
      adminRepository,
      companyRepository,
      employeeRepository,
      companyEmployeeRoleRepository,
      redisService,
      emailService,
      passwordService,
      tokenService
    );

    const user = await authService.googleLogin({ email, name, password: "123123" });

    const accessToken = jwt.sign(
      //@ts-ignore
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "100m",
      }
    );
    const refreshToken = jwt.sign(
      //@ts-ignore
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

// Logout Route
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job-seeker", jobSeekerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/webhooks", webhookRoutes);

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.CLIENT_URL || "sad",
//     failureRedirect: "/auth/login/failed",
//   })
//   // (req, res) => {
//   // res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
//   // }
// );

// app.get("/auth/logout", (req, res) => {
//   req.logout(() => {
//     res.clearCookie("session");
//     res.redirect(process.env.CLIENT_URL || "sad");
//   });
// });

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "User Service is running!" });
  return;
});

export default app;
