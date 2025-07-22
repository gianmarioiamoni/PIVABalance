import { NavItem } from "@/types/navigation";

/**
 * Navigation menu items configuration
 * Single source of truth for menu structure
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    exactMatch: true,
  },
  {
    href: "/dashboard/invoices",
    label: "Fatture",
    exactMatch: false,
  },
  {
    href: "/dashboard/costs",
    label: "Costi",
    exactMatch: false,
  },
  {
    href: "/dashboard/settings",
    label: "Impostazioni",
    exactMatch: false,
  },
];

/**
 * CSS classes for navigation items
 * Centralized styling configuration
 */
export const NAV_CLASSES = {
  // Base classes for navigation items
  base: "px-3 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",

  // Desktop navigation classes
  desktop: {
    base: "text-sm",
    active: "text-blue-600 bg-blue-50 focus:ring-blue-500",
    inactive:
      "text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:ring-gray-500",
  },

  // Mobile navigation classes
  mobile: {
    base: "block text-base",
    active: "text-blue-600 bg-blue-50 focus:ring-blue-500",
    inactive:
      "text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:ring-gray-500",
  },

  // Button classes
  button: {
    base: "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
    secondary:
      "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed",
  },

  // Logo classes
  logo: {
    base: "flex-shrink-0 flex items-center group",
    text: "text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors",
  },

  // User avatar classes
  avatar: {
    base: "h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium",
  },

  // Loading spinner classes
  spinner: {
    base: "animate-spin rounded-full h-4 w-4 border-b-2 border-white",
  },
} as const;

/**
 * ARIA labels for accessibility
 */
export const ARIA_LABELS = {
  navbar: "Navigazione principale",
  logo: "Vai alla home page",
  userMenu: "Menu utente",
  logout: "Esci dal sistema",
  mobileMenu: "Menu mobile",
  authButtons: "Pulsanti di autenticazione",
} as const;

/**
 * App branding configuration
 */
export const BRAND_CONFIG = {
  name: "P.IVA Balance",
  logoAlt: "P.IVA Balance Logo",
} as const;
