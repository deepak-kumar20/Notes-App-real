# Notes App Backend

Professional Node.js/Express.js backend API for the Notes App with clean architecture and separation of concerns.

## 🏗️ Architecture

This backend follows a professional MVC (Model-View-Controller) pattern with proper separation of concerns:

```
backend/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── email.js         # Email service configuration
├── controllers/         # Business logic
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management logic
│   └── notesController.js   # Notes CRUD logic
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication middleware
├── models/             # Database models
│   └── User.js         # User schema and methods
├── routes/             # API route definitions
│   ├── authRoutes.js   # Authentication routes
│   ├── userRoutes.js   # User routes
│   └── notesRoutes.js  # Notes routes
├── services/           # External service integrations
│   └── emailService.js # Email sending service
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions (JWT, OTP generation)
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies and scripts
├── server.js          # Main application entry point
└── README.md          # This file
```

## ✨ Features

- **Clean Architecture**: Proper separation of concerns
- **MVC Pattern**: Controllers, Models, and Routes are separated
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Email-based OTP for signup/signin
- **MongoDB Integration**: Mongoose ODM for database operations
- **Email Service**: Nodemailer integration for OTP delivery
- **Error Handling**: Global error handler and proper error responses
- **Input Validation**: Request validation for all endpoints
- **Security**: CORS enabled, JWT validation middleware

## 🚀 API Endpoints

### Authentication (`/api`)
- `POST /send-signup-otp` - Send OTP for user registration
- `POST /send-signin-otp` - Send OTP for user login
- `POST /verify-signup-otp` - Verify signup OTP and create account
- `POST /verify-signin-otp` - Verify signin OTP and login
- `POST /resend-otp` - Resend OTP for signup/signin
- `POST /signout` - Sign out user (protected)

### User Management (`/api`)
- `GET /profile` - Get user profile (protected)

### Notes Management (`/api/notes`)
- `GET /` - Get all user notes (protected)
- `POST /` - Create a new note (protected)
- `PUT /:noteId` - Update a specific note (protected)
- `DELETE /:noteId` - Delete a specific note (protected)

### System
- `GET /api/health` - Health check endpoint

## 🛠️ Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server:**
```bash
npm run dev
```

4. **Start production server:**
```bash
npm start
```

4. **Start production server:**
```bash
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/notes-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com

# App Configuration
APP_NAME=Notes App
PORT=3001
```

## 📦 Dependencies

### Production Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT implementation
- **bcryptjs** - Password hashing
- **nodemailer** - Email service
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Development Dependencies
- **nodemon** - Development server with auto-reload

## 🏛️ Architecture Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
3. **Clean Code**: Readable, maintainable, and well-documented code
4. **Error Handling**: Proper error handling at every level
5. **Security**: JWT authentication, input validation, and secure practices

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Error message sanitization

## 🚀 Deployment

This backend can be deployed on any Node.js hosting platform:

- **Heroku**: Use the provided `package.json` scripts
- **Railway**: Direct deployment from Git
- **DigitalOcean App Platform**: Node.js droplet
- **AWS/Azure/GCP**: Container or serverless deployment

Make sure to:
1. Set environment variables on your hosting platform
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure SMTP settings for email functionality

## 🧪 Testing

```bash
# Test the health endpoint
curl http://localhost:3001/api/health

# Test authentication (requires running server)
curl -X POST http://localhost:3001/api/send-signup-otp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","dob":"1990-01-01"}'
```

## 📝 Code Structure Explanation

- **`server.js`**: Application entry point, middleware setup, route mounting
- **`config/`**: External service configurations (database, email)
- **`controllers/`**: Business logic for each feature (auth, users, notes)
- **`routes/`**: API endpoint definitions and route handlers
- **`middleware/`**: Custom middleware functions (authentication, validation)
- **`models/`**: Database schemas and model methods
- **`services/`**: External service integrations (email, payments, etc.)
- **`utils/`**: Reusable utility functions and helpers

This structure makes the codebase:
- ✅ Easy to understand and navigate
- ✅ Simple to test individual components
- ✅ Scalable for adding new features
- ✅ Maintainable by multiple developers
- ✅ Ready for production deployment
