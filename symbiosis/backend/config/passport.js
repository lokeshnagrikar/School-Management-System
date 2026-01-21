const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Student = require('../models/Student');
const sendEmail = require('../utils/emailService');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/users/google/callback`,
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

          // Create Linked Student Record
          await Student.create({
            user: user._id,
            name: profile.displayName,
            email: email,
            admissionNumber: 'A' + Math.floor(100 + Math.random() * 900), // Format: AXXX (e.g., A123)
            // Class, Section, Parent details will be updated by Admin later
            status: 'Active' 
          });

          // Send Welcome Email
          try {
              const message = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">Welcome to Symbiosis School! 🎓</h2>
                    <p style="font-size: 16px; color: #333;">Hello <strong>${profile.displayName}</strong>,</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        We are thrilled to have you join our digital campus! Your account has been successfully created using your Google credentials.
                    </p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #374151;">Your temporary system password:</p>
                        <p style="margin: 5px 0 0; font-family: monospace; font-size: 18px; color: #1f2937;">${randomPassword}</p>
                    </div>

                    <p style="font-size: 14px; color: #666;">
                        You can use this password to log in directly or continue using the "Login with Google" button. 
                        We recommend setting a new password in your profile settings for added security.
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL}/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        If you have any questions, please contact our support team.<br>
                        &copy; ${new Date().getFullYear()} Symbiosis School. All rights reserved.
                    </p>
                </div>
              `;

              await sendEmail({
                email: user.email,
                subject: 'Welcome to Symbiosis School! 🎉',
                message,
              });
              
          } catch (emailError) {
              console.error('Failed to send welcome email:', emailError);
              // Do not fail the login process just because email failed
          }

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
