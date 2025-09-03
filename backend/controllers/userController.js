const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-verificationOTP -signInOTP -otpExpires -signInOTPExpires');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        lastSignIn: user.lastSignIn,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

module.exports = {
  getProfile
};
