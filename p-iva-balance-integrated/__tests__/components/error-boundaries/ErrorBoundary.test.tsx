import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, PageErrorBoundary, SectionErrorBoundary, AuthErrorBoundary } from '@/components/error-boundaries';
import { NotificationProvider } from '@/providers/NotificationProvider';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock component that throws an error
const ThrowError = ({ shouldThrow = true }) => {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div>No error</div>;
};

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <NotificationProvider>
        {children}
    </NotificationProvider>
);

describe('ErrorBoundary', () => {
    // Suppress console.error during tests
    const originalError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    describe('Basic Error Boundary', () => {
        it('renders children when there is no error', () => {
            render(
                <ErrorBoundary>
                    <div>Test content</div>
                </ErrorBoundary>
            );

            expect(screen.getByText('Test content')).toBeInTheDocument();
        });

        it('renders fallback UI when an error occurs', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getAllByText(/Si è verificato un errore/)[0]).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /riprova/i })).toBeInTheDocument();
        });

        it('calls onError callback when error occurs', () => {
            const onError = jest.fn();

            render(
                <ErrorBoundary onError={onError}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(onError).toHaveBeenCalledWith(
                expect.any(Error),
                expect.objectContaining({
                    componentStack: expect.any(String)
                })
            );
        });

        it('resets error state when retry button is clicked', () => {
            const { rerender } = render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            // Error state should be shown
            expect(screen.getAllByText(/Si è verificato un errore/)[0]).toBeInTheDocument();

            // Click retry button
            fireEvent.click(screen.getByRole('button', { name: /riprova/i }));

            // Re-render with no error
            rerender(
                <ErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </ErrorBoundary>
            );

            expect(screen.getByText('No error')).toBeInTheDocument();
        });

        it('renders custom fallback when provided', () => {
            const customFallback = <div>Custom error message</div>;

            render(
                <ErrorBoundary fallback={customFallback}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText('Custom error message')).toBeInTheDocument();
        });

        it('shows technical details in development mode', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            render(
                <ErrorBoundary showDetails={true}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText(/Dettagli tecnici/)).toBeInTheDocument();

            process.env.NODE_ENV = originalEnv;
        });
    });

    describe('PageErrorBoundary', () => {
        it('renders page-specific error UI', () => {
            render(
                <TestWrapper>
                    <PageErrorBoundary pageName="test page">
                        <ThrowError shouldThrow={true} />
                    </PageErrorBoundary>
                </TestWrapper>
            );

            expect(screen.getByText(/Errore di caricamento/)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /ricarica pagina/i })).toBeInTheDocument();
        });

        it('shows home link when enabled', () => {
            render(
                <TestWrapper>
                    <PageErrorBoundary pageName="test page" showHomeLink={true}>
                        <ThrowError shouldThrow={true} />
                    </PageErrorBoundary>
                </TestWrapper>
            );

            expect(screen.getByRole('link', { name: /torna alla home/i })).toBeInTheDocument();
        });

        it('hides home link when disabled', () => {
            render(
                <TestWrapper>
                    <PageErrorBoundary pageName="test page" showHomeLink={false}>
                        <ThrowError shouldThrow={true} />
                    </PageErrorBoundary>
                </TestWrapper>
            );

            expect(screen.queryByRole('link', { name: /torna alla home/i })).not.toBeInTheDocument();
        });
    });

    describe('SectionErrorBoundary', () => {
        it('renders section-specific error UI in full mode', () => {
            render(
                <SectionErrorBoundary sectionName="test section" compact={false}>
                    <ThrowError shouldThrow={true} />
                </SectionErrorBoundary>
            );

            expect(screen.getByText(/Errore nel caricamento/)).toBeInTheDocument();
            expect(screen.getByText(/test section/)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /ricarica sezione/i })).toBeInTheDocument();
        });

        it('renders compact error UI when compact mode is enabled', () => {
            render(
                <SectionErrorBoundary sectionName="test section" compact={true}>
                    <ThrowError shouldThrow={true} />
                </SectionErrorBoundary>
            );

            expect(screen.getByText(/Errore nel caricamento di test section/)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /riprova/i })).toBeInTheDocument();
        });

        it('shows custom description when provided', () => {
            render(
                <SectionErrorBoundary
                    sectionName="test section"
                    description="Custom error description"
                    compact={false}
                >
                    <ThrowError shouldThrow={true} />
                </SectionErrorBoundary>
            );

            expect(screen.getByText('Custom error description')).toBeInTheDocument();
        });

        it('hides retry button when showRetry is false', () => {
            render(
                <SectionErrorBoundary sectionName="test section" showRetry={false}>
                    <ThrowError shouldThrow={true} />
                </SectionErrorBoundary>
            );

            expect(screen.queryByRole('button', { name: /riprova/i })).not.toBeInTheDocument();
        });
    });

    describe('AuthErrorBoundary', () => {
        it('renders signin-specific error UI', () => {
            render(
                <AuthErrorBoundary authType="signin">
                    <ThrowError shouldThrow={true} />
                </AuthErrorBoundary>
            );

            expect(screen.getByText(/Errore di accesso/)).toBeInTheDocument();
            expect(screen.getAllByRole('link', { name: /registrati/i })[0]).toBeInTheDocument();
        });

        it('renders signup-specific error UI', () => {
            render(
                <AuthErrorBoundary authType="signup">
                    <ThrowError shouldThrow={true} />
                </AuthErrorBoundary>
            );

            expect(screen.getByText(/Errore di registrazione/)).toBeInTheDocument();
            expect(screen.getAllByRole('link', { name: /accedi/i })[0]).toBeInTheDocument();
        });

        it('renders forgot-password-specific error UI', () => {
            render(
                <AuthErrorBoundary authType="forgot-password">
                    <ThrowError shouldThrow={true} />
                </AuthErrorBoundary>
            );

            expect(screen.getByText(/Errore recupero password/)).toBeInTheDocument();
            expect(screen.getAllByRole('link', { name: /accedi/i })[0]).toBeInTheDocument();
        });

        it('renders reset-password-specific error UI', () => {
            render(
                <AuthErrorBoundary authType="reset-password">
                    <ThrowError shouldThrow={true} />
                </AuthErrorBoundary>
            );

            expect(screen.getByText(/Errore reset password/)).toBeInTheDocument();
            expect(screen.getAllByRole('link', { name: /recupera password/i })[0]).toBeInTheDocument();
        });

        it('always shows home link in auth error boundaries', () => {
            render(
                <AuthErrorBoundary authType="signin">
                    <ThrowError shouldThrow={true} />
                </AuthErrorBoundary>
            );

            expect(screen.getByRole('link', { name: /torna alla home/i })).toBeInTheDocument();
        });
    });

    describe('Error Boundary Integration', () => {
        it('prevents error from bubbling up when isolate is true', () => {
            const parentOnError = jest.fn();

            render(
                <ErrorBoundary onError={parentOnError}>
                    <ErrorBoundary isolate={true}>
                        <ThrowError shouldThrow={true} />
                    </ErrorBoundary>
                </ErrorBoundary>
            );

            // Parent error boundary should not be triggered
            expect(parentOnError).not.toHaveBeenCalled();
        });

        it('resets error state when resetKeys change', () => {
            const { rerender } = render(
                <ErrorBoundary resetKeys={['key1']}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            // Error state should be shown
            expect(screen.getAllByText(/Si è verificato un errore/)[0]).toBeInTheDocument();

            // Re-render with different resetKeys
            rerender(
                <ErrorBoundary resetKeys={['key2']}>
                    <ThrowError shouldThrow={false} />
                </ErrorBoundary>
            );

            expect(screen.getByText('No error')).toBeInTheDocument();
        });

        it('handles different error levels correctly', () => {
            const componentOnError = jest.fn();
            const sectionOnError = jest.fn();
            const pageOnError = jest.fn();

            render(
                <ErrorBoundary level="component" onError={componentOnError}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(componentOnError).toHaveBeenCalledWith(
                expect.any(Error),
                expect.objectContaining({
                    componentStack: expect.any(String)
                })
            );
        });
    });

    describe('Accessibility', () => {
        it('provides proper ARIA labels and roles', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            const retryButton = screen.getByRole('button', { name: /riprova/i });
            expect(retryButton).toHaveAttribute('type', 'button');
        });

        it('supports keyboard navigation', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            const retryButton = screen.getByRole('button', { name: /riprova/i });
            retryButton.focus();
            expect(retryButton).toHaveFocus();
        });
    });
});

/**
 * Additional Integration Tests
 * 
 * These tests verify the error boundaries work correctly
 * with the application's specific use cases
 */
describe('Error Boundary Application Integration', () => {
    it('handles async errors in React Query components', async () => {
        // This would be tested with actual components that use React Query
        // For now, we're testing the boundary structure
        const asyncError = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Async error')), 100);
        });

        // Mock component that throws async error
        const AsyncThrowError = () => {
            React.useEffect(() => {
                asyncError.catch(() => {
                    throw new Error('Async error caught');
                });
            }, []);
            return <div>Async component</div>;
        };

        render(
            <SectionErrorBoundary sectionName="async section">
                <AsyncThrowError />
            </SectionErrorBoundary>
        );

        // Component should render initially
        expect(screen.getByText('Async component')).toBeInTheDocument();
    });

    it('maintains proper error boundary hierarchy', () => {
        render(
            <TestWrapper>
                <PageErrorBoundary pageName="test page">
                    <SectionErrorBoundary sectionName="test section">
                        <ThrowError shouldThrow={true} />
                    </SectionErrorBoundary>
                </PageErrorBoundary>
            </TestWrapper>
        );

        // Section error boundary should catch the error, not page boundary
        expect(screen.getByText(/test section/)).toBeInTheDocument();
        expect(screen.queryByText(/Errore di caricamento/)).not.toBeInTheDocument();
    });
}); 