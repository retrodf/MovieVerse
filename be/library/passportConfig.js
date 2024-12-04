const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // This allows us to access the request in the callback
      scope: ['profile', 'email']
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Full Google Profile:', JSON.stringify(profile, null, 2)); // Detailed profile logging
        console.log('Access Token:', accessToken);
        
        const emails = profile.emails || [];
        console.log('Extracted Emails:', emails);

        if (emails.length === 0) {
          console.error('No emails found in Google profile');
          return done(null, false, { message: 'No email found in Google profile' });
        }

        const userEmail = emails[0].value;
        
        if (!userEmail) {
          console.error('Email is undefined or empty');
          return done(null, false, { message: 'Unable to extract email' });
        }

        console.log('User Email:', userEmail);

        let user = await User.findOne({ where: { email: userEmail } });

        // If the user doesn't exist, create a new one
        if (!user) {
          user = await User.create({
            name: profile.displayName || '',
            email: userEmail,
            username: userEmail.split('@')[0],
            role: 'user',
            googleId: profile.id,
            isVerified: 1 // Set isVerified to 1 for new users
          });
        } else {
          // If user exists, make sure isVerified is set to 1
          user.isVerified = 1;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, false);
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
    done(err, false);
  }
});

module.exports = passport;