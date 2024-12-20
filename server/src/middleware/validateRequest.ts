import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation middleware
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La password deve essere di almeno 6 caratteri'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Il nome è obbligatorio')
];

export const loginValidation = [
  body('email')
    .custom((value) => {
      if (value !== value.replace(/<[^>]*>/g, '')) {
        throw new Error('Email o password non validi');
      }
      return true;
    })
    .isEmail()
    .withMessage('Email o password non validi')
    .normalizeEmail(),
  body('password')
    .custom((value) => {
      if (value !== value.replace(/<[^>]*>/g, '')) {
        throw new Error('Email o password non validi');
      }
      return true;
    })
    .notEmpty()
    .withMessage('Email o password non validi')
];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Check if any error is related to malicious input
    const hasMaliciousInput = errors.array().some(err => 
      err.msg === 'Email o password non validi' && 
      ('path' in err && (err.path === 'email' || err.path === 'password'))
    );

    res.status(hasMaliciousInput ? 401 : 400).json({
      message: hasMaliciousInput ? 'Email o password non validi' : 'Validazione fallita',
      errors: errors.array().map(err => err.msg)
    });
    return;
  }
  next();
};
