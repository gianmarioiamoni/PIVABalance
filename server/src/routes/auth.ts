import express from 'express';
import { authController } from '../controllers/authController';
import { 
  registerValidation, 
  loginValidation, 
  validateRequest,
  sanitizeQueryParams 
} from '../middleware/inputValidation';
import { validateCsrfToken } from '../middleware/csrf';
import { auth } from '../middleware/auth';

const router = express.Router();

// Applica sanitizeQueryParams a tutte le route
router.use(sanitizeQueryParams);

// Auth routes
router.post('/register', validateCsrfToken, registerValidation, validateRequest, authController.register);
router.post('/login', validateCsrfToken, loginValidation, validateRequest, authController.login);
router.get('/current-user', auth, authController.getCurrentUser);
router.post('/logout', auth, authController.logout);

// Google OAuth routes
router.get('/google', authController.handleGoogleSignIn);
router.get('/google/callback', authController.getGoogleCallback, authController.googleCallback);

export default router;
