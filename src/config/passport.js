import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/User.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        // Match Email's User
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
          return done(null, false, { message: "User not found." });
        }

        // Match Password's User
        const isMatch = await user.matchPassword(password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect Password." });
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
