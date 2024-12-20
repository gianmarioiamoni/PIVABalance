import { Request, Response, NextFunction } from 'express';

export const validateCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  const csrfToken = req.header('x-csrf-token');
  const expectedToken = req.csrfToken?.();
  
  if (!csrfToken || !expectedToken || csrfToken !== expectedToken) {
    res.status(403).json({ message: 'Token CSRF mancante o non valido' });
    return;
  }

  next();
};
