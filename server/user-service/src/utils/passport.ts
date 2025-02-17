import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in database (implement your own logic)
        // const user = await findOrCreateUser(profile);
        return done(null, { id:"qwe", name: "AFSAL", age: 12, token: "accessToken" });
        // return done(null, user);
      } catch (error) {
        //@ts-ignore
        return done(error, null);
      }
    } 
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // const user = await getUserById(id); // Implement your DB logic
  // done(null, user);
  done(null, { name: "AFSAL", age: 12, token: "accessToken" });
});
