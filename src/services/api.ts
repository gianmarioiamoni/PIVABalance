/**
 * Enhanced API Client for Next.js API Routes
 *
 * Replaces the old axios-based client that connected to separate Express backend.
 * Now uses Next.js API Routes with proper JWT authentication and ApiResponse format.
 *
 * Features:
 * - TypeScript strict typing (zero 'any')
 * - JWT token management
 * - ApiResponse format handling
 * - Error handling and retry logic
 * - Request/response interceptors
 * - SOLID principles adherence
 */

import { ApiResponse } from "@/types";

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

/**
 * Default configuration for API client
 */
const defaultConfig: ApiClientConfig = {
  baseURL: "/api", // Next.js API Routes
  timeout: 10000, // 10 seconds
  retries: 2,
};

/**
 * Custom error class for API errors
 * Provides structured error handling
 */
export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Request options interface
 */
interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Enhanced API Client Class
 * Follows Single Responsibility Principle - handles only HTTP communication
 */
class ApiClient {
  private config: ApiClientConfig;
  private authToken: string | null = null;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeAuth();
  }

  /**
   * Initialize authentication from localStorage
   * Only runs on client side
   */
  private initializeAuth(): void {
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("token");
    }
  }

  /**
   * Set authentication token
   * Updates both instance and localStorage
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build complete URL
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.config.baseURL}${cleanEndpoint}`;
  }

  /**
   * Build request headers
   * Includes authentication and content type headers
   */
  private buildHeaders(
    customHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    // Add authentication header if token is available
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Process API response
   * Handles ApiResponse format and error extraction
   */
  private async processResponse<T>(response: Response): Promise<T> {
    let data: unknown;

    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError("Invalid JSON response from server", response.status, {
        originalError: error,
      });
    }

    // Check if response follows ApiResponse format
    if (typeof data === "object" && data !== null && "success" in data) {
      const apiResponse = data as ApiResponse<T>;

      if (!apiResponse.success) {
        throw new ApiError(
          apiResponse.message || "API request failed",
          response.status,
          apiResponse
        );
      }

      if (apiResponse.data === undefined) {
        throw new ApiError(
          "API response data is missing",
          response.status,
          apiResponse
        );
      }

      return apiResponse.data;
    }

    // Handle legacy responses that don't follow ApiResponse format
    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  }

  /**
   * Make HTTP request with retry logic
   * Core request method with error handling and retries
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions,
    retryCount = 0
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options.headers);

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
      signal: options.signal,
    };

    // Add body for non-GET requests
    if (options.body && options.method !== "GET") {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      // Handle authentication errors
      if (response.status === 401) {
        this.setAuthToken(null);
        // Redirect to login if we're on the client side
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        throw new ApiError("Authentication required", 401);
      }

      return await this.processResponse<T>(response);
    } catch (error) {
      // Retry logic for network errors
      if (retryCount < this.config.retries && error instanceof TypeError) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      // Re-throw ApiError instances
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network and other errors
      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
        { originalError: error }
      );
    }
  }

  /**
   * HTTP Methods
   * Public interface following REST conventions
   */

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "GET", signal });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data,
      signal,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data,
      signal,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    signal?: AbortSignal
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body: data,
      signal,
    });
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "DELETE", signal });
  }
}

/**
 * Global API client instance
 * Singleton pattern for consistent authentication state
 */
export const api = new ApiClient();

/**
 * Legacy default export for backward compatibility
 * Gradually migrate imports to use named export 'api'
 */
export default api;
