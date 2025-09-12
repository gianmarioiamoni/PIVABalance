/**
 * Widget Container Component
 * 
 * SRP: Handles ONLY widget container layout and basic interactions
 * Separates container logic from widget content
 */

import React from 'react';
import { RefreshCw, X, Move, Settings } from 'lucide-react';
import { BaseWidgetProps, WidgetSize } from './types';

/**
 * Widget Container Props
 * SRP: Interface for container-specific properties only
 */
export interface WidgetContainerProps extends BaseWidgetProps {
    children: React.ReactNode;
    isResizable?: boolean;
    isDraggable?: boolean;
    showControls?: boolean;
}

/**
 * Size Configuration Mapping
 * SRP: Handles only size-to-CSS mapping logic
 */
const getSizeClasses = (size: WidgetSize): string => {
    const sizeMap: Record<WidgetSize, string> = {
        small: 'col-span-1 row-span-1',
        medium: 'col-span-2 row-span-1',
        large: 'col-span-2 row-span-2',
        full: 'col-span-full row-span-2'
    };
    return sizeMap[size];
};

/**
 * Widget Container Component (Server-Compatible Base)
 * 
 * SRP Responsibilities:
 * 1. Widget container layout ONLY
 * 2. Basic widget controls rendering ONLY
 * 3. Size and position management ONLY
 * 
 * NOT responsible for:
 * - Widget content logic
 * - Data fetching
 * - Complex interactions (delegated to hooks)
 */
export const WidgetContainer: React.FC<WidgetContainerProps> = ({
    config,
    data,
    isEditing = false,
    onConfigChange,
    onRemove,
    onRefresh,
    children,
    isResizable = true,
    isDraggable = true,
    showControls = true,
    className = ''
}) => {
    // Widget state indicators
    const isLoading = data?.isLoading ?? false;
    const hasError = !!data?.error;
    const lastUpdated = data?.lastUpdated;

    // Container classes based on state
    const containerClasses = [
        'widget-container',
        'bg-white rounded-lg shadow-sm border border-gray-200',
        'transition-all duration-200',
        getSizeClasses(config.size),
        isEditing ? 'ring-2 ring-blue-200 shadow-md' : '',
        hasError ? 'border-red-300 bg-red-50' : '',
        isLoading ? 'opacity-75' : '',
        // Drag cursor now handled by parent grid container
        className
    ].filter(Boolean).join(' ');

    // Handle widget actions
    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh(config.id); // Call with widget ID
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove(config.id);
        }
    };

    const handleSettings = () => {
        // Show widget settings modal with current configuration
        const _currentSettings = {
            title: config.title,
            size: config.size,
            refreshInterval: config.refreshInterval,
            isVisible: config.isVisible,
            ...config.customSettings
        };

        // For now, show current settings and allow title change
        const newTitle = prompt(
            `Impostazioni Widget:\n\n` +
            `Titolo attuale: ${config.title}\n` +
            `Dimensione: ${config.size}\n` +
            `Intervallo aggiornamento: ${config.refreshInterval}s\n` +
            `Visibile: ${config.isVisible ? 'Sì' : 'No'}\n` +
            `Ultimo aggiornamento: ${lastUpdated?.toLocaleString('it-IT') || 'Mai'}\n\n` +
            `Inserisci nuovo titolo (lascia vuoto per non modificare):`,
            config.title
        );

        if (newTitle !== null && newTitle.trim() !== '' && newTitle !== config.title) {
            if (onConfigChange) {
                onConfigChange({
                    ...config,
                    title: newTitle.trim()
                });
            }
        }
    };

    const handleRemoveWithConfirm = () => {
        const confirmMessage = `Sei sicuro di voler rimuovere il widget "${config.title}"?\n\nQuesta azione non può essere annullata.`;
        if (confirm(confirmMessage)) {
            handleRemove();
        }
    };

    return (
        <div className={containerClasses} data-widget-id={config.id}>
            {/* Widget Header */}
            <div className="widget-header flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    {/* Drag Handle (only in edit mode) */}
                    {isEditing && isDraggable && (
                        <div className="drag-handle cursor-move p-1 text-gray-400 hover:text-gray-600">
                            <Move className="h-4 w-4" />
                        </div>
                    )}

                    {/* Widget Title */}
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {config.title}
                    </h3>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                </div>

                {/* Widget Controls */}
                {showControls && (
                    <div className="flex items-center space-x-1">
                        {/* Last Updated */}
                        {lastUpdated && !isLoading && (
                            <span className="text-xs text-gray-500 mr-2">
                                {lastUpdated.toLocaleTimeString('it-IT', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        )}

                        {/* Refresh Button - Always visible */}
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                            aria-label="Aggiorna widget"
                            title="Aggiorna dati"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Settings Button - Only in edit mode */}
                        {isEditing && (
                            <button
                                onClick={handleSettings}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                aria-label="Impostazioni widget"
                                title="Configurazione widget"
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                        )}

                        {/* Remove Button - Only in edit mode */}
                        {isEditing && (
                            <button
                                onClick={handleRemoveWithConfirm}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                aria-label="Rimuovi widget"
                                title="Rimuovi widget"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Widget Content */}
            <div className="widget-content flex-1 min-h-0">
                {hasError ? (
                    /* Error State */
                    <div className="p-4 text-center">
                        <div className="text-red-500 mb-2">
                            <X className="h-8 w-8 mx-auto" />
                        </div>
                        <p className="text-sm text-red-600 mb-2">Errore nel caricamento</p>
                        <p className="text-xs text-red-500">{data?.error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-3 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                            Riprova
                        </button>
                    </div>
                ) : (
                    /* Widget Content */
                    <div className="p-4 h-full">
                        {children}
                    </div>
                )}
            </div>

            {/* Resize Handle (edit mode) */}
            {isEditing && isResizable && (
                <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400 opacity-50" />
                </div>
            )}
        </div>
    );
};

export default WidgetContainer;
