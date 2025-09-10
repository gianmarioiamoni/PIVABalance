"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, User } from "@/services/authService";
import { useLocalStorage } from "./useLocalStorage";
import { useRouter } from "next/navigation";

/**
 * Authentication hook with React Query integration
 *
 * Manages authentication state, user data, and auth operations
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [token, setToken, isLoaded] = useLocalStorage<string>("token");

  // Query for user authentication status
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      if (!token) {
        return null;
      }
      try {
        const result = await authService.checkAuth();
        return result;
      } catch (error) {
        console.error("Auth check error:", error);
        throw error;
      }
    },
    enabled: isLoaded && !!token, // Only run query when localStorage is loaded AND token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  /**
   * Check authentication status and refresh user data
   */
  const checkAuth = useCallback(async () => {
    try {
      console.log("🔍 checkAuth - invalidating queries...");
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      console.log("🔍 checkAuth - calling refetch...");
      const result = await refetch();
      console.log("🔍 checkAuth - refetch result:", {
        data: result.data,
        error: result.error,
      });
      return result.data;
    } catch (error) {
      console.error("Auth check failed:", error);
      return null;
    }
  }, [queryClient, refetch]);

  /**
   * Wrapper for refetch to match AuthContextType signature
   */
  const refetchWrapper = useCallback(async () => {
    try {
      const result = await refetch();
      return { data: result.data ?? null };
    } catch (error) {
      console.error("Refetch failed:", error);
      return undefined;
    }
  }, [refetch]);

  /**
   * Logout user and clear all auth data
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // Clear token and user data
      setToken(null);
      queryClient.setQueryData(["auth"], null);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Redirect to signin page
      router.push("/signin");
    }
  }, [queryClient, setToken, router]);

  /**
   * Update authentication token and refresh user data
   */
  const updateToken = useCallback(
    async (newToken: string) => {
      console.log(
        "🔍 updateToken - starting with token:",
        newToken ? "EXISTS" : "NULL"
      );

      // Set token and wait for it to be available
      setToken(newToken);

      // Wait a bit for localStorage to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clear cache and refetch with new token
      queryClient.setQueryData(["auth"], null);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });

      console.log("🔍 updateToken - calling checkAuth...");
      const userData = await checkAuth();
      console.log("🔍 updateToken - checkAuth result:", userData);
      return userData;
    },
    [setToken, queryClient, checkAuth]
  );

  /**
   * Sign in with credentials
   */
  const signIn = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        console.log("🔍 useAuth.signIn - starting authentication");
        const authResponse = await authService.signIn(credentials);
        console.log("🔍 useAuth.signIn - authService response:", {
          hasToken: !!authResponse.token,
          hasUser: !!authResponse.user,
        });

        const userData = await updateToken(authResponse.token);
        console.log("🔍 useAuth.signIn - updateToken result:", { userData });

        console.log("✅ useAuth.signIn - returning authResponse:", {
          hasToken: !!authResponse.token,
          hasUser: !!authResponse.user,
        });
        return authResponse;
      } catch (error) {
        console.error("Sign in failed:", error);
        throw error;
      }
    },
    [updateToken]
  );

  /**
   * Sign up with credentials
   */
  const signUp = useCallback(
    async (credentials: { email: string; password: string; name: string }) => {
      try {
        const authResponse = await authService.signUp(credentials);
        await updateToken(authResponse.token);
        return authResponse;
      } catch (error) {
        console.error("Sign up failed:", error);
        throw error;
      }
    },
    [updateToken]
  );

  return {
    // State
    user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: !!user && !!token,
    error,

    // Actions
    signIn,
    signUp,
    logout,
    checkAuth,
    refetch: refetchWrapper,
    setToken: updateToken,
  };
}
