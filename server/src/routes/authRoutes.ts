import express from 'express';

import { authController } from '../controllers/authController';
import { auth } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from "../middleware/validateRequest";

const router = express.Router();

// Local auth routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/me', auth, authController.getCurrentUser);
router.post('/logout', auth, authController.logout);

// Google OAuth routes
router.get('/google', authController.handleGoogleSignIn);
router.get('/google/callback',authController.getGoogleCallback);

export default router;
