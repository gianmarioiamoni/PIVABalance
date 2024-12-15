import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: 'type' in err && err.type === 'field' ? err.path : 'UNKNOWN',
        message: err.msg
      }))
    });
    return;
  }
  next();
};
