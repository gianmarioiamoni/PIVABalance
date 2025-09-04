import { useCallback } from "react";
import { UserUtilities } from "@/types/navigation";

/**
 * Hook for user-related utilities
 *
 * Follows Single Responsibility Principle - only handles user utility functions.
 * Provides pure functions for user data manipulation.
 *
 * @returns Object with user utility functions
 */
export const useUserUtils = (): UserUtilities => {
  /**
   * Generates user initials from full name
   * @param name - User's full name
   * @returns Uppercase initials (max 2 characters)
   */
  const getUserInitials = useCallback((name: string): string => {
    if (!name || typeof name !== "string") {
      return "";
    }

    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return {
    getUserInitials,
  };
};
