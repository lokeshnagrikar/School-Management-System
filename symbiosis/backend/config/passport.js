const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/users/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        } else {
          // Generate a random password since it's required
          const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

          user = await User.create({
            name: profile.displayName,
            email: email,
            password: randomPassword, 
            role: 'STUDENT', // Default role
            profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
          });

          return done(null, user);
        }
      } catch (err) {
        console.error('Google Auth Error:', err);
        return done(err, false);
      }
    }
  )
);

module.exports = passport;
