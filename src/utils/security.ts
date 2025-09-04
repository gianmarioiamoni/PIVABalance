/**
 * Security utilities for input sanitization and validation
 * Following SOLID principles with pure functional approach
 */

/**
 * Sanitize user input by removing potentially harmful characters
 * @param input - Raw input string
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  // Remove potentially harmful characters but preserve basic functionality
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

/**
 * Escape HTML characters to prevent XSS attacks
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
export const escapeHtml = (text: string): string => {
  if (typeof text !== "string") return "";

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Validate email format with comprehensive regex
 * @param email - Email to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("La password deve avere almeno 8 caratteri");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("La password deve contenere almeno una lettera minuscola");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("La password deve contenere almeno una lettera maiuscola");
  }

  if (!/\d/.test(password)) {
    errors.push("La password deve contenere almeno un numero");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Simple password validation wrapper
 * @param password - Password to validate
 * @returns Validation result with errors
 */
export const isValidPassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  return validatePassword(password);
};

/**
 * Generate secure random string for tokens/IDs
 * @param length - Length of generated string
 * @returns Random string
 */
export const generateSecureId = (length: number = 32): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
