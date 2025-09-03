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

// Google OAuth routes
router.post('/google', googleAuth);

module.exports = router;
