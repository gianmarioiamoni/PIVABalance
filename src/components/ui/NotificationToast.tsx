import React from 'react';
import { Notification } from '@/types';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
} from './Icon';

interface NotificationToastProps {
    notification: Notification;
    onDismiss: (id: string) => void;
}

/**
 * NotificationToast Component
 * 
 * Displays individual notification with appropriate styling and icons
 * Follows SRP by handling only notification display logic
 * 
 * Features:
 * - Type-specific styling and icons
 * - Auto-dismiss functionality
 * - Optional action button
 * - Accessible with proper ARIA attributes
 * - Smooth animations (can be enhanced with CSS)
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
    notification,
    onDismiss
}) => {
    const { id, type, title, message, action } = notification;

    // Type-specific configurations
    const typeConfig = {
        success: {
            icon: CheckCircleIcon,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconColor: 'text-green-600',
            titleColor: 'text-green-800',
            messageColor: 'text-green-700'
        },
        error: {
            icon: XCircleIcon,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600',
            titleColor: 'text-red-800',
            messageColor: 'text-red-700'
        },
        warning: {
            icon: ExclamationTriangleIcon,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            iconColor: 'text-yellow-600',
            titleColor: 'text-yellow-800',
            messageColor: 'text-yellow-700'
        },
        info: {
            icon: InformationCircleIcon,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600',
            titleColor: 'text-blue-800',
            messageColor: 'text-blue-700'
        }
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;

    return (
        <div
            className={`
        flex items-start p-4 rounded-lg border shadow-sm
        ${config.bgColor} ${config.borderColor}
        transition-all duration-300 ease-in-out
      `}
            role="alert"
            aria-live="polite"
        >
            {/* Icon */}
            <IconComponent
                className={`h-5 w-5 ${config.iconColor} mr-3 flex-shrink-0 mt-0.5`}
                aria-hidden="true"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${config.titleColor} mb-1`}>
                    {title}
                </h4>
                <p className={`text-sm ${config.messageColor} mb-2`}>
                    {message}
                </p>

                {/* Optional Action */}
                {action && (
                    <button
                        onClick={action.onClick}
                        className={`
              text-sm font-medium underline 
              ${config.titleColor} hover:no-underline
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-${type === 'success' ? 'green' :
                                type === 'error' ? 'red' :
                                    type === 'warning' ? 'yellow' : 'blue'}-500
            `}
                    >
                        {action.label}
                    </button>
                )}
            </div>

            {/* Dismiss Button */}
            <button
                onClick={() => onDismiss(id)}
                className={`
          ml-4 p-1 rounded-md hover:bg-opacity-20 hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-${type === 'success' ? 'green' :
                        type === 'error' ? 'red' :
                            type === 'warning' ? 'yellow' : 'blue'}-500
          ${config.iconColor}
        `}
                aria-label="Chiudi notifica"
            >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
        </div>
    );
}; 