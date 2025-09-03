const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// JWT Strategy for API authentication
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        // User exists, return the user
        return done(null, user);
      }
      
      // Check if user exists with the same email (from regular signup)
      user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
      
      if (user) {
        // Link the Google account to existing user
        user.googleId = profile.id;
        user.profilePicture = profile.photos[0]?.value;
        user.authProvider = 'google';
        user.isVerified = true; // Google accounts are pre-verified
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value.toLowerCase(),
        profilePicture: profile.photos[0]?.value,
        authProvider: 'google',
        isVerified: true, // Google accounts are pre-verified
        // dateOfBirth is not required for Google users
      });
      
      await user.save();
      return done(null, user);
      
    } catch (error) {
      console.error('Error in Google OAuth strategy:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('Google OAuth not configured. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required.');
}

// Serialize and deserialize user for session management (if needed)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
