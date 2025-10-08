'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
    group: string;
    icon: string;
    disabled?: boolean;
    tooltip?: string;
}

interface MobileNavigationMenuProps {
    navigationItems: NavigationItem[];
    getGroupColors: (group: string, current: boolean, disabled: boolean) => {
        bg: string;
        text: string;
        accent: string;
        shadow: string;
    };
    backdropStyle?: 'blur' | 'dark' | 'light' | 'none';
}

/**
 * MobileNavigationMenu Component
 * 
 * Responsive mobile navigation with hamburger menu and slide-out drawer.
 * Follows SOLID principles with single responsibility for mobile navigation.
 * Uses Tailwind design system for consistent styling.
 */
export const MobileNavigationMenu: React.FC<MobileNavigationMenuProps> = ({
    navigationItems,
    getGroupColors,
    backdropStyle = 'blur'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    // Ensure client-side rendering to avoid hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isClient && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isClient]);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Get backdrop classes and inline styles based on style
    const getBackdropStyles = () => {
        const baseClasses = "lg:hidden fixed inset-0 transition-all duration-300";

        // Force styles with higher specificity for fresh server starts
        const forceStyles = {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
        };

        switch (backdropStyle) {
            case 'blur':
                return {
                    className: `${baseClasses}`,
                    style: {
                        ...forceStyles,
                        backdropFilter: 'blur(8px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(8px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                };
            case 'dark':
                return {
                    className: `${baseClasses}`,
                    style: {
                        ...forceStyles,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                };
            case 'light':
                return {
                    className: `${baseClasses}`,
                    style: {
                        ...forceStyles,
                        backgroundColor: 'rgba(243, 244, 246, 0.8)',
                    }
                };
            case 'none':
                return {
                    className: `${baseClasses} pointer-events-none`,
                    style: {
                        ...forceStyles,
                        backgroundColor: 'transparent',
                    }
                };
            default:
                return {
                    className: `${baseClasses}`,
                    style: {
                        ...forceStyles,
                        backdropFilter: 'blur(8px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(8px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                };
        }
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="lg:hidden fixed top-4 left-4 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                style={{ zIndex: 10000 }}
                aria-label="Apri menu di navigazione"
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-gray-700" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-700" />
                )}
            </button>

            {/* Only render backdrop and menu on client side to avoid hydration issues */}
            {isClient && (
                <>
                    {/* Backdrop with configurable style */}
                    {isOpen && backdropStyle !== 'none' && (() => {
                        const backdropStyles = getBackdropStyles();
                        return (
                            <div
                                ref={(el) => {
                                    if (el && backdropStyle === 'blur') {
                                        // Force styles via direct DOM manipulation for fresh server starts
                                        el.style.setProperty('backdrop-filter', 'blur(8px) saturate(180%)', 'important');
                                        el.style.setProperty('-webkit-backdrop-filter', 'blur(8px) saturate(180%)', 'important');
                                        el.style.setProperty('background-color', 'rgba(255, 255, 255, 0.2)', 'important');
                                    }
                                }}
                                className={backdropStyles.className}
                                style={backdropStyles.style}
                                onClick={() => setIsOpen(false)}
                                aria-hidden="true"
                                data-backdrop-style={backdropStyle}
                            />
                        );
                    })()}

                    {/* Mobile Menu Drawer */}
                    <nav
                        className={`lg:hidden fixed top-0 left-0 h-full w-80 shadow-2xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                        style={{
                            zIndex: 10001,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(12px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                            position: 'fixed',
                            top: 0,
                            left: 0
                        }}
                        aria-label="Menu di navigazione mobile"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                aria-label="Chiudi menu"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-1 overflow-y-auto py-6">
                            <div className="space-y-2 px-4">
                                {navigationItems.map((item) => {
                                    const colors = getGroupColors(item.group, item.current, item.disabled || false);

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.disabled ? '#' : item.href}
                                            className={`
                                        group relative flex items-center px-4 py-3 rounded-lg transition-all duration-200
                                        ${item.current
                                                    ? `${colors.bg} ${colors.text} shadow-md`
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }
                                        ${item.disabled
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer hover:shadow-sm'
                                                }
                                    `}
                                            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                                            title={item.tooltip}
                                        >
                                            {/* Icon */}
                                            <span className="text-xl mr-3 flex-shrink-0">
                                                {item.icon}
                                            </span>

                                            {/* Text */}
                                            <span className="font-medium text-sm leading-tight">
                                                {item.name}
                                            </span>

                                            {/* Active indicator */}
                                            {item.current && (
                                                <div className={`absolute right-3 w-2 h-2 rounded-full ${colors.accent.replace('bg-', 'bg-')}`} />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4">
                            <p className="text-xs text-gray-500 text-center">
                                PIVABalance Dashboard
                            </p>
                        </div>
                    </nav>
                </>
            )}
        </>
    );
};
