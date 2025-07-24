'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoadingSpinner } from "@/components/ui";

/**
 * AuthRedirectWrapper Component (Client Component)
 * 
 * Single Responsibility: Handle authentication logic and redirects
 * Requires client-side rendering for hooks (useAuth, useRouter, useEffect)
 */
interface AuthRedirectWrapperProps {
    children: React.ReactNode;
}

export const AuthRedirectWrapper: React.FC<AuthRedirectWrapperProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect authenticated users to dashboard
        if (isAuthenticated && !isLoading) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading during auth check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center surface-primary">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Show children only for non-authenticated users
    if (!isAuthenticated) {
        return <>{children}</>;
    }

    // Return nothing while redirecting
    return null;
}; 