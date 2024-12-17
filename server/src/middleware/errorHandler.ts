import { ErrorRequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { IUser } from '../models/User';

// Extend Express Request
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    token?: string;
  }
}

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler<any, any, any, any, Record<string, any>> = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export { errorHandler };
