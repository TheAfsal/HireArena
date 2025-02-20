"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists in database (implement your own logic)
        // const user = await findOrCreateUser(profile);
        return done(null, { id: "qwe", name: "AFSAL", age: 12, token: "accessToken" });
        // return done(null, user);
    }
    catch (error) {
        //@ts-ignore
        return done(error, null);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    // const user = await getUserById(id); // Implement your DB logic
    // done(null, user);
    done(null, { name: "AFSAL", age: 12, token: "accessToken" });
});
