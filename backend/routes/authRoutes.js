const express = require('express');
const router = express.Router();
const {
  sendSignupOTP,
  sendSigninOTP,
  verifySignupOTP,
  verifySigninOTP,
  resendOTP,
  googleAuth
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Authentication routes
router.post('/send-signup-otp', sendSignupOTP);
router.post('/send-signin-otp', sendSigninOTP);
router.post('/verify-signup-otp', verifySignupOTP);
router.post('/verify-signin-otp', verifySigninOTP);
router.post('/resend-otp', resendOTP);

// Redirect route for legacy signup endpoint
router.all('/signup', (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Direct signup not supported. Use OTP-based authentication.',
    correctEndpoints: {
      step1: 'POST /api/send-signup-otp',
      step2: 'POST /api/verify-signup-otp'
    }
  });
});

// Google OAuth routes
router.post('/google', googleAuth);

module.exports = router;
