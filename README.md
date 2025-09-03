# Notes App

A full-stack notes application with separate frontend and backend architecture, featuring OTP-based authentication and CRUD operations for notes.

## 🚀 Technologies Used

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
├── backend/              # Backend API server
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── .env.example     # Environment variables template
│   ├── package.json     # Backend dependencies
│   ├── server.js        # Main server file
│   └── README.md        # Backend documentation
├── frontend/            # Frontend React app
│   ├── src/            # React source code
│   │   ├── components/ # Reusable UI components
│   │   │   ├── auth/  # Authentication components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   └── ui/    # Base UI components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions
│   │   ├── pages/     # Page components
│   │   ├── App.tsx    # Main app component
│   │   └── main.tsx   # Entry point
│   ├── public/        # Static assets
│   ├── .env           # Frontend environment variables
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
├── start-dev.bat      # Windows batch startup script
├── start-dev.ps1      # PowerShell startup script
└── README.md          # This file
```

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- SMTP email service (for OTP delivery)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file with:**
   - MongoDB connection string
   - SMTP email settings
   - JWT secret
   - Other configurations

5. **Start backend development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   The `.env` file should already contain:
   ```bash
   VITE_BASE_URL=http://localhost:3001/api
   ```

4. **Start frontend development server:**
   ```bash
   npm run dev
   ```

## 🚀 Running the Application

1. **Start the backend server:**
   ```bash
   cd backend && npm run dev
   ```
   Backend will run on: http://localhost:3001

2. **Start the frontend server (in another terminal):**
   ```bash
   cd frontend && npm run dev
   ```
   Frontend will run on: http://localhost:5173

## 📱 Features

### Authentication
- OTP-based signup and signin
- JWT token authentication
- Email verification
- Protected routes

### Notes Management
- Create, read, update, delete notes
- Tag notes for organization
- Mark notes as important
- Search and filter functionality

### User Interface
- Responsive design
- Modern UI with Radix components
- Toast notifications
- Loading states
- Error handling

## 🌐 Available Routes

### Frontend Routes
- `/` - Dashboard (protected)
- `/signin` - User sign in page
- `/signup` - User sign up page

### Backend API Endpoints
- `POST /api/send-signup-otp` - Send signup OTP
- `POST /api/send-signin-otp` - Send signin OTP
- `POST /api/verify-signup-otp` - Verify signup OTP
- `POST /api/verify-signin-otp` - Verify signin OTP
- `GET /api/notes` - Get user notes (protected)
- `POST /api/notes` - Create note (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

## 🔧 Environment Variables

### Frontend (`frontend/.env`)
```
VITE_BASE_URL=http://localhost:3001/api
```

### Backend (`backend/.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_email_password
ADMIN_EMAIL=your_admin_email
APP_NAME=Notes App
PORT=3001
```

## 🚀 Production Deployment

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
npm start
```

### For Hosting
- **Backend**: Deploy the `backend/` folder to your server (Heroku, Railway, etc.)
- **Frontend**: Deploy the `frontend/` folder to a static hosting service (Vercel, Netlify, etc.)
- Update the `VITE_BASE_URL` in frontend `.env` to point to your production backend URL

## 🎯 Next Steps

- [ ] Add unit tests for both frontend and backend
- [ ] Implement note sharing functionality
- [ ] Add file attachments to notes
- [ ] Implement real-time synchronization
- [ ] Add mobile app with React Native
- [ ] Set up CI/CD pipeline
- [ ] Add Docker containerization

---

Happy coding! 🎉
# Notes-App-real
