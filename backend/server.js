const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import configuration
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://notes-app-real.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: [
      "Cross-Origin-Opener-Policy",
      "Cross-Origin-Embedder-Policy",
    ],
  })
);

// Add security headers
app.use((req, res, next) => {
  // Allow popups and cross-origin windows for Google Sign-In
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});
app.use(express.json());

// Initialize passport only if Google OAuth is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const passport = require("./config/passport");
  app.use(passport.initialize());
}

// Routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

// Root route for basic server info
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notes App API Server is running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/*",
      users: "/api/users/*",
      notes: "/api/notes/*",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Notes App Server is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Notes App Server running on port ${PORT}`);
  console.log(`Admin email configured: ${process.env.ADMIN_EMAIL}`);
  console.log("MongoDB connection status will be displayed above");
});

module.exports = app;
