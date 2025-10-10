import React from 'react';

/**
 * Enhanced Button Component with WCAG 2.1 AA Compliance
 * 
 * Provides accessible button with proper ARIA attributes and keyboard support.
 * Extends standard button functionality with accessibility best practices.
 * 
 * Features:
 * - WCAG 2.1 AA compliant focus indicators
 * - Proper ARIA attributes for screen readers
 * - Keyboard navigation support
 * - Loading and disabled states
 * - High contrast support
 */

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Caricamento...',
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  'aria-describedby': ariaDescribedby,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
  ...props
}) => {
  const baseClasses = 'btn-base';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-describedby={ariaDescribedby}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      {...props}
    >
      {isLoading && (
        <div 
          className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" 
          aria-hidden="true" 
        />
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span>
        {isLoading ? loadingText : children}
      </span>
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};
