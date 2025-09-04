import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { NavigationState, NavItemVariant } from "@/types/navigation";
import { NAV_CLASSES } from "@/components/layout/navbar/constants";

/**
 * Hook for navigation logic and CSS classes
 *
 * Follows Single Responsibility Principle - only handles navigation state logic.
 * Provides utilities for active state detection and CSS class generation.
 *
 * @returns Object with navigation utilities
 */
export const useNavigation = (): NavigationState => {
  const pathname = usePathname();

  /**
   * Determines if a navigation item is active
   * @param href - The href to check
   * @param exactMatch - Whether to use exact match or startsWith
   */
  const isActive = useCallback(
    (href: string, exactMatch = false): boolean => {
      if (!pathname) return false;

      return exactMatch ? pathname === href : pathname.startsWith(href);
    },
    [pathname]
  );

  /**
   * Generates CSS classes for navigation items
   * @param href - The href to generate classes for
   * @param exactMatch - Whether to use exact match for active state
   * @param variant - Desktop or mobile variant
   */
  const getNavItemClass = useCallback(
    (
      href: string,
      exactMatch = false,
      variant: NavItemVariant = "desktop"
    ): string => {
      const isItemActive = isActive(href, exactMatch);
      const variantClasses = NAV_CLASSES[variant];

      const baseClasses = [NAV_CLASSES.base, variantClasses.base].join(" ");

      const stateClasses = isItemActive
        ? variantClasses.active
        : variantClasses.inactive;

      return `${baseClasses} ${stateClasses}`;
    },
    [isActive]
  );

  return {
    isActive,
    getNavItemClass,
  };
};
