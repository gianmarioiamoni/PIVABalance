'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * Props for LogoutButton component
 * Following Interface Segregation Principle
 */
interface LogoutButtonProps {
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * LogoutButton Component
 * 
 * Single Responsibility: Handles user logout functionality
 * Open/Closed: Extensible through props without modification
 * Liskov Substitution: Can be used anywhere a button is expected
 * Interface Segregation: Minimal, focused props interface
 * Dependency Inversion: Depends on useAuth abstraction
 * 
 * @param props - Component props
 * @returns Logout button component
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const { logout, isLoading: authLoading, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handle logout with loading state management
   * Following Single Responsibility Principle
   */
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  // Button styling based on variant and size
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      default: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      outline: 'border border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500',
      ghost: 'text-red-700 hover:bg-red-50 focus:ring-red-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
  };

  // Show placeholder if no user but we're in an authenticated context
  // This prevents the button from disappearing during auth refresh
  if (!user) {
    return (
      <div className={getButtonClasses()} style={{ opacity: 0.5 }}>
        <span>Logout</span>
      </div>
    );
  }

  const isDisabled = authLoading || isLoggingOut;
  const buttonText = isLoggingOut ? 'Logout...' : 'Logout';

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isDisabled}
      className={getButtonClasses()}
      aria-label="Esci dal sistema"
    >
      {isLoggingOut && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {buttonText}
    </button>
  );
};
