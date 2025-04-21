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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const jobSeekerRoutes_1 = __importDefault(require("./routes/jobSeekerRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("../src/utils/passport");
const JobSeekerRepository_1 = __importDefault(require("./repositories/JobSeekerRepository"));
const AdminRepository_1 = __importDefault(require("./repositories/AdminRepository"));
const CompanyRepository_1 = __importDefault(require("./repositories/CompanyRepository"));
const prismaClient_1 = __importDefault(require("./config/prismaClient"));
const EmployeeRepository_1 = __importDefault(require("./repositories/EmployeeRepository"));
const RedisServices_1 = __importDefault(require("./services/RedisServices"));
const PasswordServices_1 = __importDefault(require("./services/PasswordServices"));
const TokenServices_1 = __importDefault(require("./services/TokenServices"));
const EmailServices_1 = __importDefault(require("./services/EmailServices"));
const AuthService_1 = __importDefault(require("./services/AuthService"));
dotenv_1.default.config();
// import stripeLib from "stripe";
// const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY || "");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "your_random_secret",
    resave: false,
    saveUninitialized: false,
}));
// app.use(passport.initialize());
// app.use(passport.session());
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
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
}), async (req, res) => {
    if (!req.user) {
        return res.redirect("http://localhost:3000/login");
    }
    //@ts-ignore
    const userProfile = req.user;
    if (!userProfile) {
        return res.redirect("http://localhost:3000/login");
    }
    const email = userProfile.emails[0].value;
    const name = userProfile.displayName;
    const jobSeekerRepository = new JobSeekerRepository_1.default(prismaClient_1.default);
    const adminRepository = new AdminRepository_1.default(prismaClient_1.default);
    const companyRepository = new CompanyRepository_1.default(prismaClient_1.default);
    const employeeRepository = new EmployeeRepository_1.default(prismaClient_1.default);
    const redisService = new RedisServices_1.default();
    const passwordService = new PasswordServices_1.default();
    const tokenService = new TokenServices_1.default();
    const emailService = new EmailServices_1.default();
    const authService = new AuthService_1.default(jobSeekerRepository, adminRepository, companyRepository, employeeRepository, redisService, emailService, passwordService, tokenService);
    const user = await authService.googleLogin({
        email,
        name,
        password: "123123",
    });
    if (!user) {
        throw new Error("User not found");
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET || "", {
        expiresIn: "100m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, role: "HR" }, process.env.REFRESH_TOKEN_SECRET || "", {
        expiresIn: "7d",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`http://localhost:3000/google-login?token=${accessToken}`);
});
app.get("/auth/logout", (req, res) => {
    req.logout(() => {
        res.clearCookie("refreshToken");
        res.redirect("/");
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/company", companyRoutes_1.default);
app.use("/api/job-seeker", jobSeekerRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/subscription", subscriptionRoutes_1.default);
app.use("/webhooks", webhookRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "User Service is running!" });
    return;
});
exports.default = app;
