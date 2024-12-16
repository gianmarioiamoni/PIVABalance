import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface JwtPayload {
  userId: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try to get token from Authorization header or query parameter
    let token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token as string;

    if (!token) {
      res.status(401).json({ message: 'Authentication token missing' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};
