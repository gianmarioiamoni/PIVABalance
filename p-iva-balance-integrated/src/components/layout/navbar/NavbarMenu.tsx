import { NAVIGATION_ITEMS, ARIA_LABELS } from './constants';
import { NavItem } from './NavItem';

/**
 * Props for NavbarMenu component
 * Following Interface Segregation Principle
 */
interface NavbarMenuProps {
    isAuthenticated: boolean;
    className?: string;
}

/**
 * NavbarMenu Component
 * 
 * Follows Single Responsibility Principle - only handles desktop navigation menu.
 * Uses configuration-driven approach for easy extensibility.
 * 
 * @param props - Component props
 * @returns Desktop navigation menu component
 */
export const NavbarMenu: React.FC<NavbarMenuProps> = ({
    isAuthenticated,
    className = ''
}) => {
    

    if (!isAuthenticated) {
        return null;
    }

    const menuClasses = `hidden md:flex ml-10 space-x-8 ${className}`.trim();

    return (
        <nav
            className={menuClasses}
            aria-label={ARIA_LABELS.navbar}
            role="navigation"
        >
            {NAVIGATION_ITEMS.map((item) => (
                <NavItem
                    key={item.href}
                    item={item}
                    variant="desktop"
                />
            ))}
        </nav>
    );
}; 