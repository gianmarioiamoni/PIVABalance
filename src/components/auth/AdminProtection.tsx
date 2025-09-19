'use client';

import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { ShieldExclamationIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AdminProtectionProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'super_admin';
    fallback?: React.ReactNode;
}

/**
 * Admin Protection Component
 * 
 * Protects components/pages that require admin access.
 * Shows appropriate error messages for unauthorized users.
 * 
 * Features:
 * - Role-based access control
 * - Custom fallback UI
 * - Loading state handling
 * - Clear error messaging
 */
export const AdminProtection: React.FC<AdminProtectionProps> = ({
    children,
    requiredRole = 'admin',
    fallback
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifica autorizzazioni...</p>
                </div>
            </div>
        );
    }

    // Check authentication
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="card">
                        <div className="card-body py-12">
                            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
                            <h2 className="heading-md mb-4 text-red-800">Accesso Negato</h2>
                            <p className="text-gray-600 mb-6">
                                È necessario effettuare il login per accedere a questa pagina.
                            </p>
                            <a href="/signin" className="btn-primary">
                                Vai al Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Check role authorization
    const hasRequiredRole = () => {
        const userRole = (user as { role?: string }).role;
        if (requiredRole === 'super_admin') {
            return userRole === 'super_admin';
        }
        if (requiredRole === 'admin') {
            return userRole === 'admin' || userRole === 'super_admin';
        }
        return true;
    };

    if (!hasRequiredRole()) {
        // Show custom fallback if provided
        if (fallback) {
            return <>{fallback}</>;
        }

        // Default unauthorized message
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="card">
                        <div className="card-body py-12">
                            <ShieldExclamationIcon className="h-16 w-16 text-orange-500 mx-auto mb-6" />
                            <h2 className="heading-md mb-4 text-orange-800">Accesso Limitato</h2>
                            <p className="text-gray-600 mb-4">
                                Questa pagina è riservata agli amministratori del sistema.
                            </p>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-orange-700">
                                    <strong>Il tuo ruolo:</strong> {
                                        (user as { role?: string }).role === 'user' ? 'Utente' :
                                            (user as { role?: string }).role === 'admin' ? 'Amministratore' :
                                                'Super Amministratore'
                                    }
                                </p>
                                <p className="text-sm text-orange-700 mt-1">
                                    <strong>Richiesto:</strong> {
                                        requiredRole === 'super_admin' ? 'Super Amministratore' : 'Amministratore'
                                    }
                                </p>
                            </div>
                            <a href="/dashboard" className="btn-primary">
                                Torna alla Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // User has required role, show protected content
    return <>{children}</>;
};
