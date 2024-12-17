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
    const { email, password, name } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already registered' });
        return;
      }

      // Create new user
      const user = new User({ email, password, name });
      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(user._id);

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }
      
      res.json({
        id: user._id,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Error getting user data' });
    }
  },

  // Logout user
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Error during logout' });
    }
  },

  // Google OAuth callback
  googleCallback: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as IUser;
      if (!user) {
        res.redirect(`${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`);
        return;
      }

      const token = generateToken(user._id);
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`);
    }
  }
};
