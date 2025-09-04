"use client";

import React, { useEffect } from 'react';
import { NotificationToast } from './NotificationToast';
import { Notification } from '@/types';

interface NotificationContainerProps {
    notifications: Notification[];
    onDismiss: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

/**
 * NotificationContainer Component
 * 
 * Manages the display and positioning of notification toasts
 * Handles auto-dismiss functionality and animations
 * 
 * Features:
 * - Configurable positioning
 * - Auto-dismiss with configurable duration
 * - Stacked notifications with proper spacing
 * - Responsive design
 * - Portal-like fixed positioning
 */
export const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    onDismiss,
    position = 'top-right'
}) => {
    // Auto-dismiss logic
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        notifications.forEach((notification) => {
            // Default duration: 5 seconds for success/info, 7 seconds for warning/error
            const defaultDuration = notification.type === 'success' || notification.type === 'info' ? 5000 : 7000;
            const duration = notification.duration ?? defaultDuration;

            // Don't auto-dismiss if duration is 0
            if (duration > 0) {
                const timer = setTimeout(() => {
                    onDismiss(notification.id);
                }, duration);
                timers.push(timer);
            }
        });

        // Cleanup timers on unmount or notifications change
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [notifications, onDismiss]);

    // Position configurations
    const positionClasses = {
        'top-right': 'fixed top-4 right-4 z-50',
        'top-left': 'fixed top-4 left-4 z-50',
        'bottom-right': 'fixed bottom-4 right-4 z-50',
        'bottom-left': 'fixed bottom-4 left-4 z-50',
        'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50'
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div
            className={`${positionClasses[position]} max-w-sm w-full space-y-3`}
            aria-live="polite"
            aria-label="Notifiche"
        >
            {notifications.map((notification, index) => (
                <div
                    key={notification.id}
                    className={`
            transform transition-all duration-300 ease-in-out
            ${index === 0 ? 'translate-y-0 opacity-100' : ''}
          `}
                    style={{
                        animationDelay: `${index * 100}ms`
                    }}
                >
                    <NotificationToast
                        notification={notification}
                        onDismiss={onDismiss}
                    />
                </div>
            ))}
        </div>
    );
}; 