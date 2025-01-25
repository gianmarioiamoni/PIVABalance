import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';

// Store invalidated tokens
const invalidatedTokens = new Set<string>();

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // First check for session authentication
        if (req.isAuthenticated()) {
            return next();
        }

        // If no session, try JWT authentication
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const token = authHeader.replace('Bearer ', '');

        // Check if token is invalidated
        if (invalidatedTokens.has(token)) {
            res.status(401).json({ message: 'Please authenticate' });
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
                throw new Error();
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Please authenticate' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export const invalidateToken = (token: string): void => {
    invalidatedTokens.add(token);
};

// Clean up old tokens periodically
const cleanup = setInterval(() => {
    invalidatedTokens.clear();
}, 24 * 60 * 60 * 1000);

// Prevent the timer from keeping the process alive
cleanup.unref();

// Clean up on process exit
process.on('exit', () => {
    clearInterval(cleanup);
});
