'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Notification, NotificationContextType } from '@/types';
import { NotificationContainer } from '@/components/ui/NotificationContainer';

// Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

/**
 * NotificationProvider Component
 * 
 * Provides global notification state management
 * Follows Context + Reducer pattern for predictable state updates
 * 
 * Features:
 * - Global notification state
 * - Auto-dismiss functionality
 * - Convenience methods for different notification types
 * - Unique ID generation for notifications
 * - Memory-efficient notification cleanup
 */
export function NotificationProvider({
    children,
    position = 'top-right'
}: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Generate unique ID for notifications
    const generateId = useCallback(() => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Add notification
    const addNotification = useCallback((
        notification: Omit<Notification, 'id' | 'createdAt'>
    ): string => {
        const id = generateId();
        const newNotification: Notification = {
            ...notification,
            id,
            createdAt: new Date()
        };

        setNotifications(prev => [newNotification, ...prev]);
        return id;
    }, [generateId]);

    // Remove notification
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Convenience methods
    const showSuccess = useCallback((
        title: string,
        message: string,
        duration?: number
    ): string => {
        return addNotification({
            type: 'success',
            title,
            message,
            duration
        });
    }, [addNotification]);

    const showError = useCallback((
        title: string,
        message: string,
        duration?: number
    ): string => {
        return addNotification({
            type: 'error',
            title,
            message,
            duration: duration ?? 0 // Error messages don't auto-dismiss by default
        });
    }, [addNotification]);

    const showWarning = useCallback((
        title: string,
        message: string,
        duration?: number
    ): string => {
        return addNotification({
            type: 'warning',
            title,
            message,
            duration
        });
    }, [addNotification]);

    const showInfo = useCallback((
        title: string,
        message: string,
        duration?: number
    ): string => {
        return addNotification({
            type: 'info',
            title,
            message,
            duration
        });
    }, [addNotification]);

    const contextValue: NotificationContextType = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <NotificationContainer
                notifications={notifications}
                onDismiss={removeNotification}
                position={position}
            />
        </NotificationContext.Provider>
    );
}

/**
 * Hook to use the notification context
 * 
 * @returns Notification context with state and actions
 * @throws Error if used outside of NotificationProvider
 */
export function useNotifications(): NotificationContextType {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }

    return context;
} 