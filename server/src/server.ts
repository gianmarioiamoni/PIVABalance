import dotenv from "dotenv";
// Load environment variables before other imports
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import { securityHeaders } from "./middleware/securityHeaders";
import authRoutes from "./routes/authRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import professionalFundRoutes from "./routes/professionalFundRoutes";
import "./config/passport";
import { initializeInpsParameters2024 } from "./models/InpsParameters";
import { initializationService } from "./services/initializationService";

const app: Express = express();
export { app }; // Export for testing
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(securityHeaders);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token']
  })
);

// Cookie parser middleware
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      httpOnly: true
    }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection
app.use(csrf());

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
  res.json({ csrfToken: token });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/professional-funds", professionalFundRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Please refresh the page and try again'
    });
  } else {
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// Database connection
async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
    
    // Initialize data after successful connection
    await Promise.all([
      initializeInpsParameters2024(),
      initializationService.initializeProfessionalFunds()
    ]);
    console.log("Data initialization completed");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CSRF protection enabled`);
      console.log(`Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only start the server if this file is being run directly
if (require.main === module) {
  startServer();
}
