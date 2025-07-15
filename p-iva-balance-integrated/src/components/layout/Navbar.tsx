'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui';
import { useState } from 'react';

/**
 * Navbar Component
 * 
 * Main navigation bar with authentication-aware menu
 * Shows different options based on user authentication status
 */
export const Navbar = () => {
    const pathname = usePathname();
    const { user, logout, isLoading, isAuthenticated } = useAuthContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            // Navigation is handled by the logout function
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    const getUserInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isAuthPage = pathname?.startsWith('/auth');

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href={isAuthenticated ? "/dashboard" : "/"}
                            className="flex-shrink-0 flex items-center group"
                        >
                            <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                P.IVA Balance
                            </span>
                        </Link>

                        {/* Navigation Menu for authenticated users */}
                        {isAuthenticated && (
                            <div className="hidden md:flex ml-10 space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/dashboard'
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/invoices"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname?.startsWith('/invoices')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Fatture
                                </Link>
                                <Link
                                    href="/costs"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname?.startsWith('/costs')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Costi
                                </Link>
                                <Link
                                    href="/tax-settings"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname?.startsWith('/tax-settings')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Impostazioni
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isLoading ? (
                            <LoadingSpinner size="sm" />
                        ) : isAuthenticated && user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 hidden sm:block">
                                    Benvenuto, {user.name}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                                >
                                    {isLoggingOut ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Uscita...
                                        </div>
                                    ) : (
                                        'Esci'
                                    )}
                                </button>

                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                    {getUserInitials(user.name)}
                                </div>
                            </div>
                        ) : !isAuthPage ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/auth/signin"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Accedi
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Registrati
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Mobile menu for authenticated users */}
                {isAuthenticated && (
                    <div className="md:hidden pb-3 pt-2 space-y-1 border-t border-gray-200 mt-2">
                        <Link
                            href="/dashboard"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname === '/dashboard'
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/invoices"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname?.startsWith('/invoices')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            Fatture
                        </Link>
                        <Link
                            href="/costs"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname?.startsWith('/costs')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            Costi
                        </Link>
                        <Link
                            href="/tax-settings"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname?.startsWith('/tax-settings')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            Impostazioni
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}; 