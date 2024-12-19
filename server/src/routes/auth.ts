import express from 'express';
import { authController } from '../controllers/authController';
import { 
  registerValidation, 
  loginValidation, 
  validateRequest,
  sanitizeQueryParams 
} from '../middleware/inputValidation';

const router = express.Router();

// Applica sanitizeQueryParams a tutte le route
router.use(sanitizeQueryParams);

// Auth routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/current-user', authController.getCurrentUser);
router.post('/logout', authController.logout);

// Google OAuth routes
router.get('/google', authController.handleGoogleSignIn);
router.get('/google/callback', authController.getGoogleCallback, authController.googleCallback);

export default router;
