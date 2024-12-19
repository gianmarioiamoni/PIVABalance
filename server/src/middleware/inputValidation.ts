import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain, Result } from 'express-validator';
import { sanitizeUserInput } from '../utils/sanitization';

export const registerValidation: ValidationChain[] = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .customSanitizer(value => sanitizeUserInput.email(value)),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
    .customSanitizer(value => sanitizeUserInput.password(value)),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name can only contain letters and spaces')
    .customSanitizer(value => sanitizeUserInput.name(value))
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .customSanitizer(value => sanitizeUserInput.email(value)),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .customSanitizer(value => sanitizeUserInput.password(value))
];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: Result = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : err.type,
        message: err.msg
      }))
    });
    return;
  }

  // Sanitize the entire request body
  req.body = sanitizeUserInput.sanitizeObject(req.body);
  
  next();
};

// Middleware per sanitizzare i parametri delle query
export const sanitizeQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        req.query[key] = sanitizeUserInput.text(value);
      }
    }
  }
  next();
};
