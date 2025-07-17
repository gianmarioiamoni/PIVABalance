'use client';

import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui';
import { NavbarLogo } from './NavbarLogo';
import { NavbarMenu } from './NavbarMenu';
import { UserProfile } from './UserProfile';
import { AuthButtons } from './AuthButtons';
import { MobileMenu } from './MobileMenu';
import { ARIA_LABELS } from './constants';

/**
 * Navbar Component (Refactored)
 * 
 * Follows Single Responsibility Principle - only handles main navbar layout.
 * Uses composition pattern with extracted components for better maintainability.
 * Implements SOLID principles with clear separation of concerns.
 */
export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout, isLoading, isAuthenticated } = useAuthContext();

  const isAuthPage = pathname?.startsWith('/auth');
  const shouldShowAuthButtons = !isAuthenticated && !isAuthPage;

  return (
    <nav 
      className="bg-white shadow-lg sticky top-0 z-40"
      aria-label={ARIA_LABELS.navbar}
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and Desktop Menu */}
          <div className="flex items-center">
            <NavbarLogo isAuthenticated={isAuthenticated} />
            <NavbarMenu isAuthenticated={isAuthenticated} />
          </div>

          {/* Right side: User Profile or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : isAuthenticated && user ? (
              <UserProfile 
                user={user} 
                logoutFn={logout}
              />
            ) : shouldShowAuthButtons ? (
              <AuthButtons />
            ) : null}
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isAuthenticated={isAuthenticated} />
      </div>
    </nav>
  );
}; 