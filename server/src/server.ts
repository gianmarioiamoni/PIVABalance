import dotenv from 'dotenv';
// Load environment variables before other imports
dotenv.config();

import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import './config/passport';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    // Default to local MongoDB if MONGODB_URI is not set
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/piva-balance';
    console.log("MongoDB URI:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
