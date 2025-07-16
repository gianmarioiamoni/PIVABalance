import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui';

interface NavigationHandlerProps {
    hasChanges: () => boolean;
    showConfirmDialog: boolean;
    pendingNavigation: string | undefined;
    onConfirmNavigation: () => void;
    onCancelNavigation: () => void;
    setShowConfirmDialog: (show: boolean) => void;
    setPendingNavigation: (nav: string | undefined) => void;
    activeTab: string;
    attemptedTab: string | undefined;
    onTabChange: (newTab: string) => void;
}

/**
 * NavigationHandler Component
 * Handles navigation protection when there are unsaved changes
 * Manages browser events and tab switching with confirmation dialogs
 */
export const NavigationHandler: React.FC<NavigationHandlerProps> = ({
    hasChanges,
    showConfirmDialog,
    pendingNavigation,
    onConfirmNavigation,
    onCancelNavigation,
    setShowConfirmDialog,
    setPendingNavigation,
    activeTab,
    attemptedTab,
    onTabChange,
}) => {
    const router = useRouter();

    // Handle tab switching with unsaved changes
    useEffect(() => {
        if (attemptedTab && attemptedTab !== activeTab) {
            if (hasChanges()) {
                setShowConfirmDialog(true);
                setPendingNavigation(`tab:${attemptedTab}`);
            } else {
                // No changes, allow direct navigation
                onTabChange(attemptedTab);
            }
        }
    }, [attemptedTab, activeTab, hasChanges, setShowConfirmDialog, setPendingNavigation, onTabChange]);

    // Memoized event handlers for better performance
    const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
        if (hasChanges()) {
            e.preventDefault();
            e.returnValue = 'Ci sono modifiche non salvate. Vuoi davvero uscire?';
            return 'Ci sono modifiche non salvate. Vuoi davvero uscire?';
        }
    }, [hasChanges]);

    const handleRouteInterception = useCallback((e: PopStateEvent) => {
        if (hasChanges()) {
            e.preventDefault();
            // Push the current state back to prevent navigation
            window.history.pushState(null, '', window.location.href);
            setShowConfirmDialog(true);
            setPendingNavigation('browser:back');
            return false;
        }
        return true;
    }, [hasChanges, setShowConfirmDialog, setPendingNavigation]);

    // Setup and cleanup browser event listeners
    useEffect(() => {
        let mounted = true;

        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handleRouteInterception);

        return () => {
            mounted = false;
            // Cleanup event listeners
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleRouteInterception);
        };
    }, [handleBeforeUnload, handleRouteInterception]);

    // Enhanced confirmation handler
    const handleConfirmNavigation = useCallback(() => {
        try {
            onConfirmNavigation();

            // Handle different types of pending navigation
            if (pendingNavigation?.startsWith('tab:')) {
                const newTab = pendingNavigation.replace('tab:', '');
                onTabChange(newTab);
            } else if (pendingNavigation === 'browser:back') {
                // Allow browser back navigation
                window.history.back();
            }
        } catch (error) {
            console.error('Error during navigation confirmation:', error);
        }
    }, [onConfirmNavigation, pendingNavigation, onTabChange]);

    return (
        <ConfirmDialog
            isOpen={showConfirmDialog}
            type="warning"
            title="Modifiche non salvate"
            message="Ci sono modifiche non salvate che andranno perse. Vuoi continuare senza salvare?"
            confirmLabel="Continua senza salvare"
            cancelLabel="Rimani sulla pagina"
            onConfirm={handleConfirmNavigation}
            onCancel={onCancelNavigation}
        />
    );
}; 