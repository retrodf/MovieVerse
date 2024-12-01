// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const jwt = require("jsonwebtoken");  // Import jwt untuk membuat token
// const User = require("../models/User");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/admin/user/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0]?.value;
//         const googleId = profile.id;

//         if (!email) {
//           return done(new Error("Email is not available in the Google profile"), false);
//         }

//         let user = await User.findOne({ where: { googleId } });

//         if (!user) {
//           user = await User.findOne({ where: { email } });
//         }

//         if (!user) {
//           user = await User.create({
//             name: profile.displayName,
//             email,
//             googleId,
//             password: "",  // Tidak perlu password karena login menggunakan Google
//             role: "user",
//             username: email.split("@")[0],  // Menggunakan email untuk username
//             avatar_path: profile.photos?.[0]?.value,
//           });
//         }

//         // Membuat token JWT setelah login berhasil
//         const token = jwt.sign(
//           { userId: user.id, name: user.name, role: user.role },
//           process.env.JWT_SECRET,
//           { expiresIn: "1h" }
//         );

//         // Mengirimkan token dalam response sebagai query parameter
//         return done(null, user, (info) => {
//           const redirectUrl = `http://localhost:5173?token=${token}`;
//           res.redirect(redirectUrl);  // Arahkan ke frontend dengan token
//         });
//       } catch (error) {
//         console.error("Error in Google Strategy:", error);
//         done(error, false);
//       }
//     }
//   )
// );

// // Serialize user ID into the session
// passport.serializeUser((user, done) => {
//   console.log("Serializing user:", user.id); // Debugging log
//   done(null, user.id);
// });

// // Deserialize user from the session using ID
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       console.error("Deserialization failed: User not found");
//       return done(new Error("User not found"), null);
//     }
//     console.log("Deserializing user:", user); // Debugging log
//     done(null, user);
//   } catch (err) {
//     console.error("Error in deserializing user:", err);
//     done(err, false);
//   }
// });

// module.exports = passport;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');  // Pastikan JWT diimpor

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Pastikan profile.id dan profile.emails ada
    let user = await User.findOne({ where: { googleId: profile.id } });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        password: null, // Set null untuk password
        role: 'user',
        username: profile.emails[0].value.split('@')[0],
        avatar_path: profile.photos[0].value,
      });      
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Kirim token
    return done(null, { user, token });
  } catch (err) {
    console.error("Error saat membuat user:", err);
    done(err, null);
  }
}));

// Serialisasi dan Deserialisasi untuk Passport Session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
