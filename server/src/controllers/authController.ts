import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, IUser } from "../models/User";
import { invalidateToken } from "../middleware/auth";
import "express-session";
import passport from "passport";
import { sanitizeUserInput } from "../utils/sanitization";

// Extend Express Request type to include our user property
declare module "express" {
  interface Request {
    user?: IUser;
    token?: string;
  }
}

const generateToken = (userId: mongoose.Types.ObjectId | string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ userId: userId.toString() }, secret, { expiresIn: "24h" });
};

export const authController = {
  // Register new user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        res.status(400).json({ 
          message: 'Tutti i campi sono obbligatori',
          errors: ['Email, password e nome sono obbligatori']
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email già registrata' });
        return;
      }

      // Create new user
      const user = new User({
        email,
        password,
        name: sanitizeUserInput.name(name)
      });

      await user.save();

      const token = generateToken(user._id);
      res.status(201).json({
        message: 'Registrazione completata con successo',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Errore durante la registrazione' });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // First check if required fields are present
      if (!email || !password) {
        res.status(401).json({ message: 'Email o password non validi' });
        return;
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeUserInput.email(email);
      const sanitizedPassword = sanitizeUserInput.password(password);

      // If sanitization removes all content, treat as invalid credentials
      if (!sanitizedEmail || !sanitizedPassword || sanitizedEmail !== email || sanitizedPassword !== password) {
        res.status(401).json({ message: 'Email o password non validi' });
        return;
      }

      const user = await User.findOne({ email: sanitizedEmail });
      if (!user) {
        res.status(401).json({ message: 'Email o password non validi' });
        return;
      }

      const isMatch = await user.comparePassword(sanitizedPassword);
      if (!isMatch) {
        res.status(401).json({ message: 'Email o password non validi' });
        return;
      }

      const token = generateToken(user._id);
      res.json({
        message: 'Login effettuato con successo',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Errore durante il login' });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.headers.authorization) {
        res.status(401).json({ message: "Token di autenticazione mancante" });
        return;
      }

      if (!req.user) {
        res.status(401).json({ message: "Per favore autenticati" });
        return;
      }

      const userId = (req.user as IUser)._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Utente non trovato" });
        return;
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Errore durante il recupero dell'utente" });
    }
  },

  // Logout user
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.headers.authorization) {
        res.status(401).json({ message: "Token di autenticazione mancante" });
        return;
      }

      if (!req.user) {
        res.status(401).json({ message: "Per favore autenticati" });
        return;
      }

      const token = req.headers.authorization.split(' ')[1];
      await invalidateToken(token);
      res.status(200).json({ message: "Disconnesso con successo" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Errore durante la disconnessione" });
    }
  },

  // Google OAuth callback
  googleCallback: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        console.error("No user found in Google callback");
        res.redirect(
          `${process.env.CLIENT_URL}/auth/signin?error=Autenticazione fallita`
        );
        return;
      }

      const token = generateToken(user._id);

      // Set token in cookie for added security
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Also pass token in URL for immediate client-side access
      const dashboardUrl = new URL("/dashboard", process.env.CLIENT_URL);
      dashboardUrl.searchParams.set("token", token);

      res.redirect(dashboardUrl.toString());
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(
        `${process.env.CLIENT_URL}/auth/signin?error=Autenticazione fallita`
      );
    }
  },

  // Google signin
  handleGoogleSignIn: async (req: Request, res: Response, next: NextFunction) => {
    const state = Math.random().toString(36).substring(7);
    (req.session as any).oauthState = state;
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: false,
      state,
      prompt: 'select_account'
    })(req, res, next);
  },

  // Get Google Callback
  getGoogleCallback: async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/auth/signin?error=Autenticazione fallita`
    }, (err, user) => {
      if (err || !user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/signin?error=Autenticazione fallita`);
      }
      req.user = user;
      return authController.googleCallback(req, res);
    })(req, res, next);
  },
};
