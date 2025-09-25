import { api } from "./api";

/**
 * User interface for authentication responses
 */
export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
}

/**
 * Sign-in credentials interface
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign-up credentials interface
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

/**
 * Authentication response interface
 */
interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Enhanced Authentication Service for Next.js API Routes
 *
 * Replaces the old Express backend authentication with Next.js API Routes.
 * Uses JWT tokens and follows the new ApiResponse format.
 *
 * Features:
 * - TypeScript strict typing (zero 'any')
 * - JWT token management
 * - Error handling and validation
 * - Integration with new API client
 * - SOLID principles adherence
 */
class AuthService {
  /**
   * Sign in user with email and password
   * Uses POST /api/auth/login endpoint
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      // Update API client with the new token
      if (response.token) {
        api.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  /**
   * Sign up new user
   * Uses POST /api/auth/register endpoint
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        credentials
      );

      // Update API client with the new token
      if (response.token) {
        api.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  /**
   * Check current authentication status
   * Uses GET /api/auth/me endpoint
   */
  async checkAuth(): Promise<User | null> {
    const token = api.getAuthToken();
    if (!token || token.length === 0) {
      return null;
    }

    try {
      const user = await api.get<User>("/auth/me");
      return user;
    } catch (error) {
      // Don't log 401 errors as they are expected for unauthenticated users
      if (error instanceof Error && error.message.includes("Authentication required")) {
        // Clear invalid token silently
        api.setAuthToken(null);
        return null;
      }
      console.error("Error checking auth:", error);
      // Clear invalid token
      api.setAuthToken(null);
      return null;
    }
  }

  /**
   * Logout user
   * Clears token and redirects to login
   */
  async logout(): Promise<void> {
    try {
      // Note: Next.js API Routes don't need explicit logout call
      // JWT tokens are stateless, so we just remove it from client
      api.setAuthToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Always clear token even if server call fails
      api.setAuthToken(null);
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return api.getAuthToken();
  }

  /**
   * Set authentication token
   * Useful for setting token from external sources (e.g., URL params)
   */
  setToken(token: string): void {
    api.setAuthToken(token);
  }
}

/**
 * Global authentication service instance
 * Singleton pattern for consistent authentication state
 */
export const authService = new AuthService();
