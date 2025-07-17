import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secure-jwt-secret-key-here";

// Validate JWT_SECRET is properly configured
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be defined and at least 32 characters long");
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 * Follows Single Responsibility Principle - handles only token generation
 */
export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email,
  };

  const options: jwt.SignOptions = {
    expiresIn: "7d", // Use string literal instead of variable
    issuer: "p-iva-balance",
    audience: "p-iva-balance-users",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verify and decode a JWT token
 * Follows Single Responsibility Principle - handles only token verification
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "p-iva-balance",
      audience: "p-iva-balance-users",
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};

/**
 * Extract token from Authorization header
 * Pure function - no side effects
 */
export const extractTokenFromHeader = (
  authHeader: string | null
): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Get user from request token
 * Functional composition of token extraction and verification
 */
export const getUserFromRequest = async (
  request: NextRequest
): Promise<JwtPayload | null> => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
};

/**
 * Check if token is expired (without verification)
 * Pure function - deterministic based on input
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Get remaining token time in seconds
 * Pure function - calculates time difference
 */
export const getTokenRemainingTime = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - currentTime);
  } catch {
    return 0;
  }
};
