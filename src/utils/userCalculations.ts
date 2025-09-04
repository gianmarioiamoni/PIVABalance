import bcrypt from "bcryptjs";
import { IUser } from "@/types";

/**
 * Pure functions for user calculations and formatting
 * Follows functional programming principles
 */

/**
 * Get user's display name
 */
export const getUserDisplayName = (user: IUser): string => {
  return user.name || user.email.split("@")[0];
};

/**
 * Compare password with user's hashed password
 */
export const compareUserPassword = async (
  candidatePassword: string,
  userHashedPassword: string
): Promise<boolean> => {
  try {
    if (!candidatePassword || !userHashedPassword) {
      throw new Error("Missing password data");
    }
    return await bcrypt.compare(candidatePassword, userHashedPassword);
  } catch (_error) {
    throw new Error("Password comparison failed");
  }
};

/**
 * Hash a password for storage
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (_error) {
    throw new Error("Password hashing failed");
  }
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate name format
 */
export const validateName = (
  name: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
    return { isValid: false, errors };
  }

  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (name.length > 100) {
    errors.push("Name cannot exceed 100 characters");
  }

  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
    errors.push(
      "Name can only contain letters, spaces, apostrophes, and hyphens"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if user uses Google authentication
 */
export const isGoogleUser = (user: IUser): boolean => {
  return !!user.googleId;
};

/**
 * Check if user has password set
 */
export const hasPassword = (user: IUser): boolean => {
  return !!user.password;
};

/**
 * Clean user object for JSON output (removes sensitive data)
 */
export const cleanUserForJSON = (
  user: IUser
): Omit<IUser, "password" | "__v"> => {
  const userObj = user.toJSON?.() || user;
  const {
    password: _password,
    __v: _v,
    ...cleanUser
  } = userObj as typeof userObj & { password?: string; __v?: unknown };
  return cleanUser as Omit<IUser, "password" | "__v">;
};

/**
 * Normalize email (lowercase and trim)
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: IUser): string => {
  const displayName = getUserDisplayName(user);
  const words = displayName.split(" ");

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
};
