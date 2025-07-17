import { useState, useCallback } from "react";

/**
 * Hook for managing navigation guard logic with unsaved changes
 *
 * Follows Single Responsibility Principle - only handles navigation guard concerns.
 * Provides confirmation dialogs and pending navigation management.
 *
 * @param onTabChange - Function to call when tab change is confirmed
 * @param onCancelTabChange - Function to call when tab change is cancelled
 * @returns Object with navigation state and handlers
 */
export const useNavigationGuard = (
  onTabChange: (newTab: string) => void,
  onCancelTabChange: () => void
) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    string | undefined
  >(undefined);

  /**
   * Handle navigation confirmation
   * Processes pending navigation after user confirmation
   */
  const handleConfirmNavigation = useCallback(async () => {
    setShowConfirmDialog(false);
    if (pendingNavigation) {
      if (pendingNavigation.startsWith("tab:")) {
        const newTab = pendingNavigation.replace("tab:", "");
        onTabChange(newTab);
      }
      setPendingNavigation(undefined);
    }
  }, [pendingNavigation, onTabChange]);

  /**
   * Handle navigation cancellation
   * Cancels pending navigation and maintains current state
   */
  const handleCancelNavigation = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingNavigation(undefined);
    onCancelTabChange();
  }, [onCancelTabChange]);

  return {
    navigationState: {
      showConfirmDialog,
      pendingNavigation,
    },
    navigationActions: {
      setShowConfirmDialog,
      setPendingNavigation,
      handleConfirmNavigation,
      handleCancelNavigation,
    },
  };
};
