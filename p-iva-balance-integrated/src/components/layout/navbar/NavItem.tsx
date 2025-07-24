import Link from 'next/link';
import { NavItem as NavItemType, NavItemVariant } from '@/types/navigation';
import { useNavigation } from '@/hooks/layout';

/**
 * Props for NavItem component
 * Following Interface Segregation Principle
 */
interface NavItemProps {
    item: NavItemType;
    variant?: NavItemVariant;
    className?: string;
    onClick?: () => void;
}

/**
 * NavItem Component
 * 
 * Follows Single Responsibility Principle - only handles navigation item rendering.
 * Reusable component for consistent navigation items across desktop and mobile.
 * 
 * @param props - Component props
 * @returns Navigation item component
 */
export const NavItem: React.FC<NavItemProps> = ({
    item,
    variant = 'desktop',
    className = '',
    onClick
}) => {
    const { getNavItemClass, isActive } = useNavigation();

    const navItemClasses = `${getNavItemClass(item.href, item.exactMatch, variant)} ${className}`.trim();
    const isItemActive = isActive(item.href, item.exactMatch);

    return (
        <Link
            href={item.href}
            className={navItemClasses}
            onClick={onClick}
            aria-current={isItemActive ? 'page' : undefined}
        >
            {item.label}
        </Link>
    );
}; 