const { createTransporter } = require('../config/email');

// Send OTP via email
const sendOTPEmail = async (email, otp, isSignup = false) => {
  const transporter = createTransporter();
  
  const subject = isSignup ? 
    `${process.env.APP_NAME} - Your Sign Up OTP` : 
    `${process.env.APP_NAME} - Your Sign In OTP`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${process.env.APP_NAME}</h1>
          <p>${isSignup ? 'Welcome! Complete your sign up' : 'Sign in to your account'}</p>
        </div>
        <div class="content">
          <h2>Your OTP Code</h2>
          <p>Hello,</p>
          <p>You requested a one-time password (OTP) to ${isSignup ? 'complete your sign up' : 'sign in to your account'}.</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p><strong>This OTP is valid for 10 minutes.</strong></p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          
          <div class="footer">
            <p>Thank you for using ${process.env.APP_NAME}!</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.ADMIN_EMAIL}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail
};
