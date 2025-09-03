const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { sendOTPEmail } = require('../services/emailService');

// Only import Google OAuth library if Google OAuth is configured
let client = null;
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const { OAuth2Client } = require('google-auth-library');
  client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

// Send OTP for signup
const sendSignupOTP = async (req, res) => {
  try {
    const { name, email, dob } = req.body;

    if (!name || !email || !dob) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and date of birth are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email. Please sign in instead.'
      });
    }

    let user;
    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      user = existingUser;
      user.name = name;
      user.dateOfBirth = new Date(dob);
    } else {
      // Create new user
      user = new User({
        name,
        email: email.toLowerCase(),
        dateOfBirth: new Date(dob),
        isVerified: false
      });
    }

    // Generate and save OTP
    const otp = user.createOTP('verification');
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, true);

    res.json({
      success: true,
      message: 'OTP sent successfully to your email'
    });

  } catch (error) {
    console.error('Error sending signup OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

// Send OTP for signin
const sendSigninOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if user exists and is verified
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email. Please sign up first.'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please complete signup process first.'
      });
    }

    // Generate and save OTP
    const otp = user.createOTP('signin');
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, false);

    res.json({
      success: true,
      message: 'OTP sent successfully to your email'
    });

  } catch (error) {
    console.error('Error sending signin OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

// Verify OTP for signup
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found. Please request a new OTP.'
      });
    }

    if (!user.verificationOTP || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new one.'
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    const isOTPValid = await user.compareOTP(otp, user.verificationOTP);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // Mark user as verified and clear OTP data
    user.isVerified = true;
    user.verificationOTP = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });

  } catch (error) {
    console.error('Error verifying signup OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
};

// Verify OTP for signin
const verifySigninOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (!user.signInOTP || !user.signInOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new one.'
      });
    }

    if (Date.now() > user.signInOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    const isOTPValid = await user.compareOTP(otp, user.signInOTP);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // Clear OTP data and update last sign in
    user.signInOTP = null;
    user.signInOTPExpires = null;
    user.lastSignIn = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Signed in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth
      }
    });

  } catch (error) {
    console.error('Error verifying signin OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and type are required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found.'
      });
    }

    let otp;
    if (type === 'signup') {
      otp = user.createOTP('verification');
    } else if (type === 'signin') {
      if (!user.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email not verified. Please complete signup process first.'
        });
      }
      otp = user.createOTP('signin');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP type.'
      });
    }

    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, type === 'signup');

    res.json({
      success: true,
      message: 'OTP resent successfully to your email'
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    });
  }
};

// Sign out
const signOut = async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, we'll just return success and let the client handle token removal
    res.json({
      success: true,
      message: 'Signed out successfully'
    });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sign out'
    });
  }
};

// Google OAuth signin/signup
const googleAuth = async (req, res) => {
  try {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !client) {
      return res.status(500).json({
        success: false,
        message: 'Google authentication is not configured on this server'
      });
    }

    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the credential with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });
    
    if (user) {
      // User exists, sign them in
      const token = generateToken(user._id);
      
      // Update last sign in
      user.lastSignIn = new Date();
      await user.save();
      
      return res.json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider
        }
      });
    }
    
    // Check if user exists with the same email (from regular signup)
    user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      // Link the Google account to existing user
      user.googleId = googleId;
      user.profilePicture = picture;
      user.authProvider = 'google';
      user.isVerified = true; // Google accounts are pre-verified
      user.lastSignIn = new Date();
      await user.save();
      
      const token = generateToken(user._id);
      
      return res.json({
        success: true,
        message: 'Account linked and signed in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider
        }
      });
    }
    
    // Create new user
    user = new User({
      googleId,
      name,
      email: email.toLowerCase(),
      profilePicture: picture,
      authProvider: 'google',
      isVerified: true, // Google accounts are pre-verified
      lastSignIn: new Date()
      // dateOfBirth is not required for Google users
    });
    
    await user.save();
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Account created and signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider
      }
    });
    
  } catch (error) {
    console.error('Error in Google authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google. Please try again.'
    });
  }
};

module.exports = {
  sendSignupOTP,
  sendSigninOTP,
  verifySignupOTP,
  verifySigninOTP,
  resendOTP,
  googleAuth
};
