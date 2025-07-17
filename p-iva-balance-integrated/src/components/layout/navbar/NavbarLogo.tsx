import Link from 'next/link';
import { NAV_CLASSES, BRAND_CONFIG, ARIA_LABELS } from './constants';

/**
 * Props for NavbarLogo component
 * Following Interface Segregation Principle
 */
interface NavbarLogoProps {
    isAuthenticated: boolean;
    className?: string;
}

/**
 * NavbarLogo Component
 * 
 * Follows Single Responsibility Principle - only handles logo display and navigation.
 * Reusable component for consistent branding across the application.
 * 
 * @param props - Component props
 * @returns Logo component with navigation
 */
export const NavbarLogo: React.FC<NavbarLogoProps> = ({
    isAuthenticated,
    className = ''
}) => {
    const logoClasses = `${NAV_CLASSES.logo.base} ${className}`.trim();

    return (
        <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className={logoClasses}
            aria-label={ARIA_LABELS.logo}
        >
            <span className={NAV_CLASSES.logo.text}>
                {BRAND_CONFIG.name}
            </span>
        </Link>
    );
}; 