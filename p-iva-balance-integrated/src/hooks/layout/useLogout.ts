import { useState, useCallback } from "react";
import { LogoutState } from "@/types/navigation";

/**
 * Hook for logout functionality
 *
 * Follows Single Responsibility Principle - only handles logout logic.
 * Provides loading state management and error handling for logout process.
 *
 * @param logoutFn - The logout function from auth context
 * @returns Object with logout state and handler
 */
export const useLogout = (logoutFn: () => Promise<void>): LogoutState => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handles logout process with loading state management
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      await logoutFn();
      // Navigation is handled by the logout function
    } catch (error) {
      console.error("Logout failed:", error);
      // Reset loading state only on error
      // On success, the component will unmount due to navigation
      setIsLoggingOut(false);
    }
  }, [logoutFn]);

  return {
    isLoggingOut,
    handleLogout,
  };
};
