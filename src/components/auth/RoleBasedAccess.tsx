'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface RoleBasedAccessProps {
    children: React.ReactNode;
    allowedRoles: ('user' | 'admin' | 'super_admin')[];
    redirectSuperAdminTo?: string;
    fallback?: React.ReactNode;
}

/**
 * Role Based Access Component
 * 
 * Unified component that handles both role-based access control and redirects.
 * Replaces both BusinessProtection and SuperAdminRedirect with a single solution.
 * 
 * Features:
 * - Role-based access control
 * - Automatic super admin redirects
 * - Loading state handling
 * - Clear error messaging
 * - Prevents race conditions between redirect and protection
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
    children,
    allowedRoles,
    redirectSuperAdminTo = '/dashboard/admin',
    fallback
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    // Handle super admin redirect
    useEffect(() => {
        if (isLoading || !user) return;

        // Redirect super admin if not in allowed roles
        if (user.role === 'super_admin' && !allowedRoles.includes('super_admin')) {
            router.push(redirectSuperAdminTo);
        }
    }, [user, isLoading, router, allowedRoles, redirectSuperAdminTo]);

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

    // Show loading for super admin while redirecting
    if (user.role === 'super_admin' && !allowedRoles.includes('super_admin')) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Reindirizzamento al pannello amministrazione...
                    </p>
                </div>
            </div>
        );
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(user.role as any)) {
        // Show custom fallback if provided
        if (fallback) {
            return <>{fallback}</>;
        }

        // Super admin specific message
        if (user.role === 'super_admin') {
            return (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="max-w-lg mx-auto text-center">
                        <div className="card">
                            <div className="card-body py-12">
                                <ShieldExclamationIcon className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                                <h2 className="heading-md mb-4 text-blue-800">Accesso Limitato per Super Admin</h2>
                                <p className="text-gray-600 mb-4">
                                    Come <strong>Super Amministratore</strong>, il tuo ruolo è focalizzato sulla gestione del sistema.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-2">Le tue funzionalità:</h3>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• 👨‍💼 Gestione Utenti e Ruoli</li>
                                        <li>• 🔍 Monitoring del Sistema</li>
                                        <li>• ⚙️ Configurazioni Globali</li>
                                        <li>• 👤 Gestione Account Personale</li>
                                    </ul>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    Le funzionalità business (Dashboard, Fatture, Costi) sono riservate agli utenti operativi.
                                </p>
                                <div className="space-y-2">
                                    <a href="/dashboard/admin" className="btn-primary block">
                                        Vai al Pannello Amministrazione
                                    </a>
                                    <a href="/dashboard/monitoring" className="btn-secondary block">
                                        Vai al Monitoring
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // General access denied message
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="card">
                        <div className="card-body py-12">
                            <ShieldExclamationIcon className="h-16 w-16 text-orange-500 mx-auto mb-6" />
                            <h2 className="heading-md mb-4 text-orange-800">Accesso Limitato</h2>
                            <p className="text-gray-600 mb-4">
                                Non hai i permessi necessari per accedere a questa pagina.
                            </p>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-orange-700">
                                    <strong>Il tuo ruolo:</strong> {
                                        user.role === 'user' ? 'Utente' :
                                            user.role === 'admin' ? 'Amministratore' :
                                                'Super Amministratore'
                                    }
                                </p>
                                <p className="text-sm text-orange-700 mt-1">
                                    <strong>Ruoli richiesti:</strong> {allowedRoles.join(', ')}
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

    // User has appropriate role, show protected content
    return <>{children}</>;
};
