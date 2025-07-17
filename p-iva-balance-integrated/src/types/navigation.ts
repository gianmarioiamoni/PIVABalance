/**
 * Navigation Types
 * Types for navbar and navigation system
 */

/**
 * Navigation menu item configuration
 */
export interface NavItem {
  href: string;
  label: string;
  exactMatch?: boolean;
}

/**
 * User information for navbar display
 */
export interface NavbarUser {
  name: string;
  email?: string;
}

/**
 * Navbar component variant types
 */
export type NavItemVariant = "desktop" | "mobile";

/**
 * Navigation state and utilities
 */
export interface NavigationState {
  isActive: (href: string, exactMatch?: boolean) => boolean;
  getNavItemClass: (
    href: string,
    exactMatch?: boolean,
    variant?: NavItemVariant
  ) => string;
}

/**
 * Logout hook return type
 */
export interface LogoutState {
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

/**
 * User utilities hook return type
 */
export interface UserUtilities {
  getUserInitials: (name: string) => string;
}

/**
 * Authentication context for navbar
 */
export interface NavbarAuthContext {
  user: NavbarUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}
