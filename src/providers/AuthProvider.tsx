'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { User } from '@/services/authService';

interface AuthContextType {
    // State
    user: User | null | undefined;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: Error | null;

    // Actions
    signIn: (credentials: { email: string; password: string }) => Promise<{ token: string; user: User }>;
    signUp: (credentials: { email: string; password: string; name: string }) => Promise<{ token: string; user: User }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<User | null | undefined>;
    refetch: () => Promise<{ data: User | null } | undefined>;
    setToken: (token: string) => Promise<User | null | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application
 * Uses React Query for state management and caching
 * 
 * @param children - Child components
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const authData = useAuth();

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to use the authentication context
 * 
 * @returns Authentication context with user data and actions
 * @throws Error if used outside of AuthProvider
 */
export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }

    return context;
}

/**
 * Higher-order component for protected routes
 * Redirects to signin if user is not authenticated
 */
export function withAuth<P extends object>(
    Component: React.ComponentType<P>
): React.ComponentType<P> {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useAuthContext();

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            // This would be handled by middleware in a real app
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Accesso Richiesto
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Devi effettuare l&apos;accesso per visualizzare questa pagina.
                        </p>
                        <a
                            href="/auth/signin"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
                        >
                            Vai al Login
                        </a>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
} 