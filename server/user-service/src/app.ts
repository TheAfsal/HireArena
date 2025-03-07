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
import cookieSession from "cookie-session";
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

// Google Callback Route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  // (req, res) => {
  //   res.redirect("http://localhost:3000/job-seeker");
  // }
  async (req, res) => {
    if (!req.user) {
      return res.redirect("http://localhost:3000/login");
    }

    const user = req.user as { id: string; email: string };

    const accessToken = jwt.sign(
      { userId: "asdasd" },
      process.env.ACCESS_TOKEN_SECRET || "",
      {
        expiresIn: "1m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: "asdasd", role: "HR" },
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
