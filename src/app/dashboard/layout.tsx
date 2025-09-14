'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { PageErrorBoundary } from '@/components/error-boundaries';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

// Get group color scheme for tabs
function getGroupColors(group: string, current: boolean, disabled: boolean) {
    const colorSchemes = {
        core: {
            bg: current ? 'bg-blue-50 border-blue-200' : 'bg-blue-25 hover:bg-blue-50 border-blue-100',
            text: current ? 'text-blue-900' : 'text-blue-700 hover:text-blue-800',
            shadow: current ? 'shadow-blue-200/50' : 'shadow-blue-100/30',
            accent: 'bg-blue-500'
        },
        analytics: {
            bg: current ? 'bg-purple-50 border-purple-200' : 'bg-purple-25 hover:bg-purple-50 border-purple-100',
            text: current ? 'text-purple-900' : 'text-purple-700 hover:text-purple-800',
            shadow: current ? 'shadow-purple-200/50' : 'shadow-purple-100/30',
            accent: 'bg-purple-500'
        },
        financial: {
            bg: current ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-25 hover:bg-emerald-50 border-emerald-100',
            text: current ? 'text-emerald-900' : 'text-emerald-700 hover:text-emerald-800',
            shadow: current ? 'shadow-emerald-200/50' : 'shadow-emerald-100/30',
            accent: 'bg-emerald-500'
        },
        management: {
            bg: current ? 'bg-amber-50 border-amber-200' : 'bg-amber-25 hover:bg-amber-50 border-amber-100',
            text: current ? 'text-amber-900' : 'text-amber-700 hover:text-amber-800',
            shadow: current ? 'shadow-amber-200/50' : 'shadow-amber-100/30',
            accent: 'bg-amber-500'
        }
    };

    const scheme = colorSchemes[group as keyof typeof colorSchemes] || colorSchemes.core;

    if (disabled) {
        return {
            bg: 'bg-gray-100 border-gray-200',
            text: 'text-gray-400',
            shadow: 'shadow-gray-100/20',
            accent: 'bg-gray-400'
        };
    }

    return scheme;
}

// Component that uses useSearchParams - must be wrapped in Suspense
function DashboardContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user, isLoading, setToken } = useAuth();
    const { state: { settings } } = useTaxSettings();
    const [isClient, setIsClient] = useState(false);

    const isOrdinaryRegime = settings?.taxRegime === 'ordinario';

    // Ensure client-side rendering to avoid hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const token = searchParams.get('token');
        if (token) {
            setToken(token);
            // Clean up URL
            window.history.replaceState({}, '', '/dashboard');
            return;
        }

        // Only redirect to signin if we're sure there's no valid authentication
        // Check if there's a token in localStorage before redirecting
        if (!isLoading && !user && isClient) {
            const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!storedToken) {
                router.push('/signin');
            }
        }
    }, [searchParams, user, isLoading, router, setToken, isClient]);

    // Show loading on server-side and during initial hydration
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Show loading only if we don't have a user AND we're actually loading (not just a token refresh)
    if (!user && isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If we don't have a user and we're not loading, redirect to signin
    if (!user && !isLoading) {
        return null;
    }

    // At this point we either have a user OR we're loading, so we can proceed with rendering
    // But we need to ensure user exists for the UI elements that require it
    if (!user) {
        // This should only happen during loading states, show loading
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Normalize pathname by removing trailing slash for consistent comparison
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';

    // Helper function to check if user has required role
    const hasRole = (userRole: string, requiredRole: string): boolean => {
        const roleHierarchy: Record<string, number> = {
            user: 1,
            admin: 2,
            super_admin: 3,
        };
        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    };

    // Navigation items based on user role
    const getNavigationItems = () => {
        const currentUserRole = user.role || 'user';

        // Super Admin gets only system management items
        if (currentUserRole === 'super_admin') {
            return [
                { 
                    name: 'Amministrazione', 
                    href: '/dashboard/admin', 
                    current: normalizedPathname === '/dashboard/admin',
                    group: 'admin',
                    icon: '👨‍💼'
                },
                { 
                    name: 'Monitoring', 
                    href: '/dashboard/monitoring', 
                    current: normalizedPathname === '/dashboard/monitoring',
                    group: 'admin',
                    icon: '🔍'
                },
                { 
                    name: 'Account', 
                    href: '/dashboard/account', 
                    current: normalizedPathname === '/dashboard/account',
                    group: 'management',
                    icon: '👤'
                },
            ];
        }

        // Base items for regular users and admins
        const baseItems = [
            { 
                name: 'Dashboard', 
                href: '/dashboard', 
                current: normalizedPathname === '/dashboard',
                group: 'core',
                icon: '📊'
            },
            { 
                name: 'Dashboard Personalizzabile', 
                href: '/dashboard/customizable', 
                current: normalizedPathname === '/dashboard/customizable',
                group: 'core',
                icon: '⚙️'
            },
            { 
                name: 'Analytics Avanzate', 
                href: '/dashboard/analytics', 
                current: normalizedPathname === '/dashboard/analytics',
                group: 'analytics',
                icon: '📈'
            },
            { 
                name: 'Fatture', 
                href: '/dashboard/invoices', 
                current: normalizedPathname === '/dashboard/invoices',
                group: 'financial',
                icon: '📄'
            },
            { 
                name: 'Costi', 
                href: '/dashboard/costs', 
                current: normalizedPathname === '/dashboard/costs',
                group: 'financial',
                icon: '💰'
            },
            {
                name: 'Tasse e Contributi',
                href: '/dashboard/taxes',
                current: normalizedPathname === '/dashboard/taxes',
                disabled: isOrdinaryRegime,
                tooltip: isOrdinaryRegime ? "Tasse e Contributi disponibili solo per Regime Forfettario" : undefined,
                group: 'financial',
                icon: '🏛️'
            },
            { 
                name: 'Impostazioni', 
                href: '/dashboard/settings', 
                current: normalizedPathname === '/dashboard/settings',
                group: 'management',
                icon: '⚙️'
            },
            { 
                name: 'Account', 
                href: '/dashboard/account', 
                current: normalizedPathname === '/dashboard/account',
                group: 'management',
                icon: '👤'
            },
        ];

        // Add admin-only items for admin users (not super_admin)
        if (currentUserRole === 'admin') {
            baseItems.push(
                { 
                    name: 'Monitoring', 
                    href: '/dashboard/monitoring', 
                    current: normalizedPathname === '/dashboard/monitoring',
                    group: 'admin',
                    icon: '🔍'
                },
                { 
                    name: 'Amministrazione', 
                    href: '/dashboard/admin', 
                    current: normalizedPathname === '/dashboard/admin',
                    group: 'admin',
                    icon: '👨‍💼'
                }
            );
        }

        return baseItems;
    };

    const navigationItems = getNavigationItems();



    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="relative text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Benvenuto, {user.name}!
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            Gestisci le tue impostazioni fiscali e monitora le tue performance finanziarie.
                        </p>

                        {/* Logout Button - positioned in top right */}
                        <div className="absolute top-0 right-0">
                            <LogoutButton
                                variant="outline"
                                size="sm"
                                className="shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <div className="lg:col-span-3">
                            <div className="px-4 sm:px-0">
                                <nav className="flex flex-wrap gap-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100" aria-label="Tabs">
                                    {navigationItems.map((item) => {
                                        const colors = getGroupColors(item.group, item.current, item.disabled || false);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.disabled ? '#' : item.href}
                                                className={classNames(
                                                    // Base styling with enhanced depth
                                                    'group relative min-w-0 flex-1 min-h-[4rem] overflow-hidden rounded-lg border-2 transition-all duration-300 ease-in-out transform',

                                                    // 3D depth effects
                                                    item.current
                                                        ? 'shadow-lg scale-105 translate-y-[-2px]'
                                                        : 'shadow-md hover:shadow-lg hover:scale-102 hover:translate-y-[-1px]',

                                                    // Group colors
                                                    colors.bg,
                                                    colors.text,

                                                    // Interactive states
                                                    item.disabled
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : 'cursor-pointer hover:shadow-xl',

                                                    // Focus states
                                                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                )}
                                                style={{
                                                    boxShadow: item.current
                                                        ? `0 8px 25px -5px ${colors.shadow}, 0 4px 10px -6px ${colors.shadow}`
                                                        : `0 4px 15px -3px ${colors.shadow}, 0 2px 6px -4px ${colors.shadow}`
                                                }}
                                                aria-current={item.current ? 'page' : undefined}
                                                title={item.tooltip}
                                                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                                            >
                                                {/* Content container with perfect centering */}
                                                <div className="flex flex-col items-center justify-center h-full p-3 text-center">
                                                    {/* Icon */}
                                                    <span className="text-xl mb-1 transform transition-transform group-hover:scale-110">
                                                        {item.icon}
                                                    </span>

                                                    {/* Text with perfect vertical centering */}
                                                    <span className={classNames(
                                                        'text-xs font-medium leading-tight',
                                                        'flex items-center justify-center min-h-[2rem]'
                                                    )}>
                                                        {item.name}
                                                    </span>
                                                </div>

                                                {/* Enhanced accent bar */}
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        'absolute inset-x-0 bottom-0 h-1 transition-all duration-300',
                                                        item.current
                                                            ? `${colors.accent} opacity-100 shadow-sm`
                                                            : 'bg-transparent opacity-0 group-hover:opacity-50'
                                                    )}
                                                />

                                                {/* Subtle gradient overlay for depth */}
                                                <div className={classNames(
                                                    'absolute inset-0 opacity-0 transition-opacity duration-300',
                                                    'bg-gradient-to-t from-white/10 to-transparent',
                                                    item.current ? 'opacity-100' : 'group-hover:opacity-50'
                                                )} />
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Content */}
                            <div className="mt-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageErrorBoundary pageName="dashboard" showHomeLink={false}>
            <Suspense fallback={
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            }>
                <DashboardContent>{children}</DashboardContent>
            </Suspense>
        </PageErrorBoundary>
    );
} 