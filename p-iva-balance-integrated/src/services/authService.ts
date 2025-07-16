/**
 * Authentication Service
 *
 * Handles all authentication-related API calls
 */

import {
  ApiResponse,
  AuthResponse,
  SignInCredentials,
  SignUpCredentials,
} from "@/types";

export type { SignInCredentials, SignUpCredentials };

export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
}

interface AuthServiceError extends Error {
  status?: number;
  errors?: string[];
}

/**
 * Custom error class for authentication errors
 */
class AuthError extends Error implements AuthServiceError {
  status?: number;
  errors?: string[];

  constructor(message: string, status?: number, errors?: string[]) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Authentication service with all auth-related operations
 */
export const authService = {
  /**
   * Sign in user with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<AuthResponse> = await response.json();

      if (!response.ok) {
        throw new AuthError(
          data.message || "Sign in failed",
          response.status,
          data.errors
        );
      }

      if (!data.success || !data.data) {
        throw new AuthError("Invalid response from server");
      }

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.data.token);
      }

      return data.data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("Network error during sign in");
    }
  },

  /**
   * Sign up new user
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<AuthResponse> = await response.json();

      if (!response.ok) {
        throw new AuthError(
          data.message || "Sign up failed",
          response.status,
          data.errors
        );
      }

      if (!data.success || !data.data) {
        throw new AuthError("Invalid response from server");
      }

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.data.token);
      }

      return data.data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("Network error during sign up");
    }
  },

  /**
   * Check if user is authenticated and get user data
   */
  async checkAuth(): Promise<User | null> {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        return null;
      }

      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Token might be expired or invalid
        if (response.status === 401) {
          this.clearToken();
          return null;
        }
        throw new AuthError("Failed to check authentication");
      }

      const data: ApiResponse<User> = await response.json();

      if (!data.success || !data.data) {
        return null;
      }

      return data.data;
    } catch (error) {
      console.error("Auth check failed:", error);
      return null;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        // Call logout endpoint if available
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {
          // Ignore logout endpoint errors - just clear local token
        });
      }
    } finally {
      this.clearToken();
    }
  },

  /**
   * Clear authentication token
   */
  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  /**
   * Get current token
   */
  getToken(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  },

  /**
   * Check if user is currently authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
