import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain, Result } from 'express-validator';
import { sanitizeUserInput } from '../utils/sanitization';

export const registerValidation: ValidationChain[] = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail()
    .customSanitizer(value => sanitizeUserInput.email(value)),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('La password deve essere di almeno 8 caratteri')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale')
    .customSanitizer(value => sanitizeUserInput.password(value)),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Il nome è obbligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('Il nome deve essere tra 2 e 50 caratteri')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Il nome può contenere solo lettere e spazi')
    .customSanitizer(value => sanitizeUserInput.name(value))
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail()
    .customSanitizer(value => sanitizeUserInput.email(value)),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('La password è obbligatoria')
    .customSanitizer(value => sanitizeUserInput.password(value))
];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validazione fallita',
      errors: errors.array().map(err => err.msg)
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
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeUserInput.text(req.query[key] as string);
      }
    }
  }
  next();
};
