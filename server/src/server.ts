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
import authRoutes from "./routes/authRoutes";
import "./config/passport";

const app: Express = express();
export { app }; // Export for testing
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "x-csrf-token",
      "XSRF-TOKEN",
      "x-xsrf-token"
    ],
    exposedHeaders: ["X-CSRF-Token"]
  })
);

// Cookie parser middleware
app.use(cookieParser(process.env.SESSION_SECRET || "your-secret-key"));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      httpOnly: true
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize CSRF protection
const csrfMiddleware = csrf({
  cookie: {
    key: '_csrf',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
  }
});

// Generate and send CSRF token
app.get('/api/csrf-token', (req: Request, res: Response, next: NextFunction) => {
  csrfMiddleware(req, res, (err) => {
    if (err) {
      console.error('CSRF setup error:', err);
      return res.status(500).json({ error: 'Failed to setup CSRF protection' });
    }
    try {
      const token = req.csrfToken();
      res.cookie('XSRF-TOKEN', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: '/'
      });
      res.json({ csrfToken: token });
    } catch (error) {
      console.error('Error generating CSRF token:', error);
      res.status(500).json({ error: 'Failed to generate CSRF token' });
    }
  });
});

// Apply CSRF protection to all non-GET routes except /api/csrf-token
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.path === '/api/csrf-token') {
    return next();
  }
  
  csrfMiddleware(req, res, (err) => {
    if (err) {
      console.error('CSRF validation error:', {
        error: err,
        path: req.path,
        method: req.method,
        token: req.headers['x-csrf-token'],
        cookies: req.cookies
      });
    }
    next(err);
  });
});

// Error handler for CSRF token errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF Error:', {
      path: req.path,
      method: req.method,
      token: req.headers['x-xsrf-token'],
      cookies: req.cookies
    });
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Form has been tampered with'
    });
  }
  next(err);
});

// Routes
app.use("/api/auth", authRoutes);

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
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/piva-balance";
    console.log("MongoDB URI:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
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
