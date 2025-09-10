import Link from 'next/link';
import { NAV_CLASSES, ARIA_LABELS } from './constants';

/**
 * Props for AuthButtons component
 * Following Interface Segregation Principle
 */
interface AuthButtonsProps {
  className?: string;
}

/**
 * AuthButtons Component
 * 
 * Follows Single Responsibility Principle - only handles authentication buttons.
 * Reusable component for consistent auth UI across the application.
 * 
 * @param props - Component props
 * @returns Authentication buttons component
 */
export const AuthButtons: React.FC<AuthButtonsProps> = ({
  className = ''
}) => {
  const containerClasses = `flex items-center space-x-4 ${className}`.trim();
  const loginClasses = `${NAV_CLASSES.button.base} ${NAV_CLASSES.button.primary}`.trim();
  const signupClasses = `${NAV_CLASSES.button.base} ${NAV_CLASSES.button.secondary}`.trim();

  return (
    <div
      className={containerClasses}
      aria-label={ARIA_LABELS.authButtons}
    >
      <Link
        href="/signin"
        className={loginClasses}
        aria-label="Accedi al sistema"
      >
        Accedi
      </Link>
      <Link
        href="/auth/signup"
        className={signupClasses}
        aria-label="Registrati al sistema"
      >
        Registrati
      </Link>
    </div>
  );
}; 