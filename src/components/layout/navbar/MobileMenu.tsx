import { NAVIGATION_ITEMS, ARIA_LABELS } from './constants';
import { NavItem } from './NavItem';

/**
 * Props for MobileMenu component
 * Following Interface Segregation Principle
 */
interface MobileMenuProps {
    isAuthenticated: boolean;
    onItemClick?: () => void;
    className?: string;
}

/**
 * MobileMenu Component
 * 
 * Follows Single Responsibility Principle - only handles mobile navigation menu.
 * Uses same configuration as desktop menu for consistency.
 * 
 * @param props - Component props
 * @returns Mobile navigation menu component
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
    isAuthenticated,
    onItemClick,
    className = ''
}) => {
    if (!isAuthenticated) {
        return null;
    }

    const menuClasses = `md:hidden pb-3 pt-2 space-y-1 border-t border-gray-200 mt-2 ${className}`.trim();

    return (
        <nav
            className={menuClasses}
            aria-label={ARIA_LABELS.mobileMenu}
            role="navigation"
        >
            {NAVIGATION_ITEMS.map((item) => (
                <NavItem
                    key={item.href}
                    item={item}
                    variant="mobile"
                    onClick={onItemClick}
                />
            ))}
        </nav>
    );
}; 