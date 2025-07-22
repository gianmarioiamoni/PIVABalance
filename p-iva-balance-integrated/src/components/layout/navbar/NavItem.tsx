import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();
    const { getNavItemClass, isActive } = useNavigation();

    const navItemClasses = `${getNavItemClass(item.href, item.exactMatch, variant)} ${className}`.trim();
    const isItemActive = isActive(item.href, item.exactMatch);

    // DEBUG: Temporary console log to debug navbar active state
    if (typeof window !== 'undefined') {
        console.log('🔗 NavItem debug:', {
            label: item.label,
            href: item.href,
            exactMatch: item.exactMatch,
            pathname,
            isItemActive,
            hasActiveClass: navItemClasses.includes('text-blue-600')
        });
    }

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