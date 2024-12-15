import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';

const generateToken = (userId: mongoose.Types.ObjectId | string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ userId: userId.toString() }, secret, { expiresIn: '24h' });
};

export const authController = {
  // Register new user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email }) as IUser | null;
      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      // Create new user
      const user = await new User({
        email,
        password,
        name
      }).save() as IUser;

      const token = generateToken(user._id.toString());

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email }) as IUser | null;
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = generateToken(user._id.toString());

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      
      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error getting user data' });
    }
  },

  // Google OAuth callback
  googleCallback: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user) {
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      const token = generateToken(user._id);

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      res.status(500).json({ error: 'Error processing Google authentication' });
    }
  }
};
