import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Local auth routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/me', auth, authController.getCurrentUser);
router.post('/logout', authController.logout);

// Google OAuth routes
router.get(
  '/google',
  (req: Request, res: Response, next: NextFunction) => {
    const state = Math.random().toString(36).substring(7);
    (req.session as any).oauthState = state;
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: false,
      state,
      prompt: 'select_account'
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`
    })(req, res, next);
  },
  authController.googleCallback
);

export default router;
