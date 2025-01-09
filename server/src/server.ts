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
import { auth } from './middleware/auth';
import authRoutes from "./routes/authRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import professionalFundRoutes from "./routes/professionalFundRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import { irpefRateController } from './controllers/irpefRateController';
import "./config/passport";
import { initializeInpsParameters2024 } from "./models/InpsParameters";
import { initializationService } from "./services/initializationService";
import { IrpefRateService } from './services/irpefRateService';

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
app.use("/api/settings", auth, settingsRoutes);
app.use("/api/professional-funds", auth, professionalFundRoutes);
app.use("/api/invoices", auth, invoiceRoutes);

// IRPEF Rate routes
app.get('/api/irpef-rates', auth, irpefRateController.getCurrentRates);
app.get('/api/irpef-rates/:year', auth, irpefRateController.getRatesByYear);
app.put('/api/irpef-rates/:id', auth, irpefRateController.updateRate);
app.delete('/api/irpef-rates/:id', auth, irpefRateController.deactivateRate);

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
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
    
    // Initialize default data
    await initializeInpsParameters2024();
    await initializationService.initializeProfessionalFunds();
    await IrpefRateService.initializeDefaultRates();
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
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
