import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, IUser } from "../models/User";
import { invalidateToken } from "../middleware/auth";
import "express-session";
import passport from "passport";

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
    const { email, password, name } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }

      // Create new user
      const user = new User({ email, password, name });

      try {
        await user.validate();
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          token,
        });
      } catch (validationError: any) {
        res.status(400).json({
          message: "Validation failed",
          errors: Object.values(validationError.errors || {}).map(
            (err: any) => err.message
          ),
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      // Basic validation
      if (!email || !password) {
        res.status(400).json({
          message: "Validation failed",
          errors: ["Email and password are required"],
        });
        return;
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Check password
      try {
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          res.status(401).json({ message: "Invalid email or password" });
          return;
        }

        const token = generateToken(user._id);

        res.json({
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          token,
        });
      } catch (error) {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Error getting current user" });
    }
  },

  // Logout user
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.header("Authorization");
      if (authHeader) {
        invalidateToken(authHeader);
      }

      // Clear the session
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destruction error:", err);
          }
        });
      }

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Error during logout" });
    }
  },

  // Google OAuth callback
  googleCallback: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        console.error("No user found in Google callback");
        res.redirect(
          `${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`
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
        `${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`
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
      failureRedirect: `${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`
    }, (err, user) => {
      if (err || !user) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/signin?error=Authentication failed`);
      }
      req.user = user;
      return authController.googleCallback(req, res);
    })(req, res, next);
  },
};
