'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { PageErrorBoundary } from '@/components/error-boundaries';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

// Component that uses useSearchParams - must be wrapped in Suspense
function DashboardContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user, isLoading, setToken } = useAuth();
    const { state: { settings } } = useTaxSettings();

    const isOrdinaryRegime = settings?.taxRegime === 'ordinario';

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setToken(token);
            // Clean up URL
            window.history.replaceState({}, '', '/dashboard');
            return;
        }

        if (!isLoading && !user) {
            router.push('/auth/signin');
        }
    }, [searchParams, user, isLoading, router, setToken]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Normalize pathname by removing trailing slash for consistent comparison
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';

    const navigationItems = [
        { name: 'Dashboard', href: '/dashboard', current: normalizedPathname === '/dashboard' },
        { name: 'Dashboard Personalizzabile', href: '/dashboard/customizable', current: normalizedPathname === '/dashboard/customizable' },
        { name: 'Analytics Avanzate', href: '/dashboard/analytics', current: normalizedPathname === '/dashboard/analytics' },
        { name: 'Monitoring', href: '/dashboard/monitoring', current: normalizedPathname === '/dashboard/monitoring' },
        { name: 'Impostazioni', href: '/dashboard/settings', current: normalizedPathname === '/dashboard/settings' },
        { name: 'Fatture', href: '/dashboard/invoices', current: normalizedPathname === '/dashboard/invoices' },
        { name: 'Costi', href: '/dashboard/costs', current: normalizedPathname === '/dashboard/costs' },
        {
            name: 'Tasse e Contributi',
            href: '/dashboard/taxes',
            current: normalizedPathname === '/dashboard/taxes',
            disabled: isOrdinaryRegime,
            tooltip: isOrdinaryRegime ? "Tasse e Contributi disponibili solo per Regime Forfettario" : undefined
        },
    ];



    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Benvenuto, {user.name}!
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            Gestisci le tue impostazioni fiscali e monitora le tue performance finanziarie.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <div className="lg:col-span-3">
                            <div className="px-4 sm:px-0">
                                <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.disabled ? '#' : item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'text-gray-900'
                                                    : 'text-gray-500 hover:text-gray-700',
                                                item.disabled
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : 'hover:bg-gray-50',
                                                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium focus:z-10'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                            title={item.tooltip}
                                            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                                        >
                                            <span>{item.name}</span>
                                            <span
                                                aria-hidden="true"
                                                className={classNames(
                                                    item.current ? 'bg-indigo-500' : 'bg-transparent',
                                                    'absolute inset-x-0 bottom-0 h-0.5'
                                                )}
                                            />
                                        </Link>
                                    ))}
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