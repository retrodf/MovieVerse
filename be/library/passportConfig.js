const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Import model User

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/admin/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value;
        let avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Email is not available in the Google profile"), false);
        }

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            password: "", // Password kosong karena Google OAuth
            role: process.env.DEFAULT_ROLE || "user", // Default role
            username: email.split("@")[0],
            avatar_path: avatar,
          });
        }
        done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    console.error("Error in deserializing user:", err);
    done(err, false);
  }
});

module.exports = passport;
