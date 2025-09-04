/**
 * Widget Header Component
 * 
 * SRP: Handles ONLY widget header rendering and basic controls
 * Server-compatible component for SSR optimization
 */

import React from 'react';
import { RefreshCw, Settings, X, Move, MoreVertical, Info } from 'lucide-react';

/**
 * Widget Header Props
 * SRP: Interface for header-specific properties only
 */
export interface WidgetHeaderProps {
    title: string;
    subtitle?: string;
    isLoading?: boolean;
    isEditing?: boolean;
    isDraggable?: boolean;
    showControls?: boolean;
    showLastUpdated?: boolean;
    lastUpdated?: Date;
    onRefresh?: () => void;
    onSettings?: () => void;
    onRemove?: () => void;
    onInfo?: () => void;
    className?: string;
}

/**
 * Widget Header Component (Server-Compatible)
 * 
 * SRP Responsibilities:
 * 1. Header layout rendering ONLY
 * 2. Control buttons display ONLY
 * 3. Title and metadata display ONLY
 * 
 * NOT responsible for:
 * - Widget data logic
 * - Complex state management
 * - Business logic
 */
export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
    title,
    subtitle,
    isLoading = false,
    isEditing = false,
    isDraggable = true,
    showControls = true,
    showLastUpdated = true,
    lastUpdated,
    onRefresh,
    onSettings,
    onRemove,
    onInfo,
    className = ''
}) => {
    return (
        <div className={`widget-header flex items-center justify-between p-4 border-b border-gray-100 ${className}`}>
            {/* Left Section: Title and Drag Handle */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
                {/* Drag Handle (edit mode only) */}
                {isEditing && isDraggable && (
                    <div
                        className="drag-handle cursor-move p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Trascina per riposizionare"
                    >
                        <Move className="h-4 w-4" />
                    </div>
                )}

                {/* Title Section */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {title}
                    </h3>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <RefreshCw className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
                )}
            </div>

            {/* Right Section: Controls and Metadata */}
            {showControls && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                    {/* Last Updated Timestamp */}
                    {showLastUpdated && lastUpdated && !isLoading && (
                        <span className="text-xs text-gray-500 mr-2 hidden sm:inline">
                            {lastUpdated.toLocaleTimeString('it-IT', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    )}

                    {/* Control Buttons */}
                    <div className="flex items-center space-x-1">
                        {/* Info Button */}
                        {onInfo && (
                            <button
                                onClick={onInfo}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                aria-label="Informazioni widget"
                                title="Informazioni e aiuto"
                            >
                                <Info className="h-4 w-4" />
                            </button>
                        )}

                        {/* Refresh Button */}
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                disabled={isLoading}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                                aria-label="Aggiorna widget"
                                title="Aggiorna dati"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        )}

                        {/* Settings Button (edit mode) */}
                        {isEditing && onSettings && (
                            <button
                                onClick={onSettings}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Impostazioni widget"
                                title="Configurazione widget"
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                        )}

                        {/* Remove Button (edit mode) */}
                        {isEditing && onRemove && (
                            <button
                                onClick={onRemove}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                aria-label="Rimuovi widget"
                                title="Rimuovi widget"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {/* More Options (view mode) */}
                        {!isEditing && (
                            <button
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Opzioni widget"
                                title="Altre opzioni"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WidgetHeader;
