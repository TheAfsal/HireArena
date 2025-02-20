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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const jobSeekerRoutes_1 = __importDefault(require("./routes/jobSeekerRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("../src/utils/passport");
// import stripeLib from "stripe";
dotenv_1.default.config();
// const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY || "");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.COOKIE_SECRET || "default_secret"],
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//     secure: false, // Set true in production with HTTPS
//     httpOnly: true, // Prevent XSS attacks
//   })
// );
app.use((0, express_session_1.default)({
    secret: "your_random_secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.use(passport.initialize());
// app.use(passport.session());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// const YOUR_DOMAIN = 'http://localhost:3000';
// // Create Checkout Session endpoint
// app.post('/create-checkout-session', async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd', // Currency
//             product_data: {
//               name: 'T-shirt', // Product name
//             },
//             unit_amount: 2000, // Price in cents (this is $20.00)
//           },
//           quantity: 1, // Quantity
//         },
//       ],
//       mode: 'payment',  // Indicating this is for a payment
//       success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,  // Redirect after successful payment
//       cancel_url: `${YOUR_DOMAIN}/cancel`,  // Redirect if the user cancels the payment
//     });
//     // Redirect the user to the Stripe Checkout page
//     res.redirect(303, session.url||"");
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).send('Server error');
//   }
// });
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Google Callback Route
app.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
}), 
// (req, res) => {
//   res.redirect("http://localhost:3000/job-seeker");
// }
async (req, res) => {
    if (!req.user) {
        return res.redirect("http://localhost:3000/login");
    }
    const user = req.user;
    const accessToken = jsonwebtoken_1.default.sign({ userId: "asdasd" }, process.env.ACCESS_TOKEN_SECRET || "", {
        expiresIn: "1m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: "asdasd", role: "HR" }, process.env.REFRESH_TOKEN_SECRET || "", {
        expiresIn: "7d",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`http://localhost:3000/job-seeker?token=${accessToken}`);
});
// Logout Route
app.get("/auth/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/company", companyRoutes_1.default);
app.use("/api/job-seeker", jobSeekerRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/subscription", subscriptionRoutes_1.default);
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
app.get("/health", (req, res) => {
    res.status(200).json({ status: "User Service is running!" });
    return;
});
exports.default = app;
