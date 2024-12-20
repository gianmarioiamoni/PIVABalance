import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';

// Store invalidated tokens
const invalidatedTokens = new Set<string>();

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      res.status(401).json({ message: 'Token di autenticazione mancante' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Check if token is invalidated
    if (invalidatedTokens.has(token)) {
      res.status(401).json({ message: 'Per favore autenticati' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        res.status(401).json({ message: 'Token di autenticazione mancante' });
        return;
      }

      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      res.status(401).json({ message: 'Per favore autenticati' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Per favore autenticati' });
  }
};

export const invalidateToken = (token: string): void => {
  if (!token) return;
  
  const cleanToken = token.replace('Bearer ', '');
  invalidatedTokens.add(cleanToken);
};

// Clean up old tokens periodically
const cleanup = setInterval(() => {
  invalidatedTokens.clear();
}, 24 * 60 * 60 * 1000);

// Prevent the timer from keeping the process alive
cleanup.unref();
