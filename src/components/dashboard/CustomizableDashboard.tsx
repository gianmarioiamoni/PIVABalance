/**
 * Customizable Dashboard Component
 * 
 * SRP: Handles ONLY dashboard layout management and widget orchestration
 * Main container for customizable widget-based dashboard
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Edit3, Save, RotateCcw, Plus, Layout } from 'lucide-react';
// import { WidgetContainer } from '../widgets/base/WidgetContainer'; // Not directly used
import { WidgetSkeleton } from '../widgets/base/WidgetSkeleton';
import { WidgetLibrary } from './WidgetLibrary';
import { useDashboardLayout } from '@/hooks/widgets/useDashboardLayout';
import { WidgetRegistry } from '../widgets/registry/WidgetRegistry';
import { WidgetConfig } from '../widgets/base/types';

/**
 * Customizable Dashboard Props
 * SRP: Interface for dashboard-specific properties only
 */
export interface CustomizableDashboardProps {
    className?: string;
    defaultLayout?: string; // Layout preset name
    enableCustomization?: boolean;
    maxWidgets?: number;
}

/**
 * Dashboard Toolbar Component
 * SRP: Handles only dashboard editing controls
 */
const DashboardToolbar: React.FC<{
    isEditing: boolean;
    hasChanges: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
    onReset: () => void;
    onAddWidget: () => void;
    isLoading: boolean;
}> = ({
    isEditing,
    hasChanges,
    onToggleEdit,
    onSave,
    onReset,
    onAddWidget,
    isLoading
}) => {
        return (
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Layout className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Dashboard Personalizzata
                    </h2>
                    {isEditing && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            Modalità Modifica
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {isEditing && (
                        <>
                            {/* Add Widget Button */}
                            <button
                                onClick={onAddWidget}
                                disabled={isLoading}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Aggiungi Widget</span>
                            </button>

                            {/* Reset Button */}
                            <button
                                onClick={onReset}
                                disabled={isLoading || !hasChanges}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span>Reset</span>
                            </button>

                            {/* Save Button */}
                            <button
                                onClick={onSave}
                                disabled={isLoading || !hasChanges}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>Salva</span>
                            </button>
                        </>
                    )}

                    {/* Edit Toggle Button */}
                    <button
                        onClick={onToggleEdit}
                        disabled={isLoading}
                        className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-50 ${isEditing
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                    >
                        <Edit3 className="h-4 w-4" />
                        <span>{isEditing ? 'Termina' : 'Personalizza'}</span>
                    </button>
                </div>
            </div>
        );
    };

/**
 * Widget Size Utility
 * SRP: Handles only CSS class mapping for widget sizes
 */
const getWidgetGridClasses = (size: string): string => {
    const sizeClasses = {
        'small': 'col-span-3 row-span-1',
        'medium': 'col-span-6 row-span-1',
        'large': 'col-span-6 row-span-2',
        'full': 'col-span-12 row-span-2'
    };
    return sizeClasses[size as keyof typeof sizeClasses] || 'col-span-6 row-span-1';
};

/**
 * Widget Renderer Component  
 * SRP: Handles only individual widget rendering logic
 */
const WidgetRenderer: React.FC<{
    widget: WidgetConfig;
    isEditing: boolean;
    onWidgetChange: (id: string, updates: Partial<WidgetConfig>) => void;
    onWidgetRemove: (id: string) => void;
    onWidgetRefresh: (id: string) => void;
}> = ({ widget, isEditing, onWidgetChange, onWidgetRemove, onWidgetRefresh }) => {
    // Get the actual widget registry ID from customSettings, fallback to type for backward compatibility
    const widgetRegistryId = (widget.customSettings as { widgetRegistryId?: string })?.widgetRegistryId || widget.type;
    const registryEntry = WidgetRegistry.getById(widgetRegistryId);

    if (!registryEntry) {
        return (
            <div className={getWidgetGridClasses(widget.size)}>
                <WidgetSkeleton
                    size={widget.size}
                    title={`Widget non trovato: ${widgetRegistryId}`}
                    showHeader={true}
                />
            </div>
        );
    }

    const WidgetComponent = registryEntry.component;

    return (
        <div className={getWidgetGridClasses(widget.size)}>
            <WidgetComponent
                config={widget}
                isEditing={isEditing}
                onConfigChange={(updates) => onWidgetChange(widget.id, updates)}
                onRemove={() => onWidgetRemove(widget.id)}
                onRefresh={() => onWidgetRefresh(widget.id)}
                {...(widget.customSettings || {})}
            />
        </div>
    );
};

/**
 * Widget Grid Component
 * SRP: Handles only grid layout container
 */
const WidgetGrid: React.FC<{
    widgets: WidgetConfig[];
    isEditing: boolean;
    onWidgetChange: (id: string, updates: Partial<WidgetConfig>) => void;
    onWidgetRemove: (id: string) => void;
    onWidgetRefresh: (id: string) => void;
}> = ({ widgets, isEditing, onWidgetChange, onWidgetRemove, onWidgetRefresh }) => {
    return (
        <div className="grid grid-cols-12 gap-4 auto-rows-fr min-h-[200px]">
            {widgets.map(widget => (
                <WidgetRenderer
                    key={widget.id}
                    widget={widget}
                    isEditing={isEditing}
                    onWidgetChange={onWidgetChange}
                    onWidgetRemove={onWidgetRemove}
                    onWidgetRefresh={onWidgetRefresh}
                />
            ))}
        </div>
    );
};

/**
 * Customizable Dashboard Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Dashboard layout orchestration ONLY
 * 2. Widget management coordination ONLY
 * 3. Edit mode state management ONLY
 * 
 * NOT responsible for:
 * - Individual widget logic (delegated to widget components)
 * - Data fetching (delegated to widget hooks)
 * - Layout persistence (delegated to useDashboardLayout hook)
 */
export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
    className = '',
    defaultLayout = 'default',
    enableCustomization = true,
    maxWidgets = 20
}) => {
    const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);

    // Use dashboard layout hook for state management
    const {
        widgets,
        layout: _layout,
        isEditing,
        hasChanges,
        isLoading,
        toggleEditing,
        addWidget,
        removeWidget,
        updateWidget,
        saveLayout,
        resetLayout,
        refreshWidget,
        refreshAll: _refreshAll
    } = useDashboardLayout(defaultLayout);

    // Handle widget library actions
    const handleAddWidget = useCallback(() => {
        if (widgets.length >= maxWidgets) {
            // Show notification about max widgets
            return;
        }
        setShowWidgetLibrary(true);
    }, [widgets.length, maxWidgets]);

    const handleWidgetSelect = useCallback((widgetType: string) => {
        addWidget(widgetType);
        setShowWidgetLibrary(false);
    }, [addWidget]);

    // Handle save with success feedback
    const handleSave = useCallback(async () => {
        try {
            await saveLayout();
            // Success notification would be handled by the hook
        } catch (error) {
            console.error('Failed to save layout:', error);
            // Error notification would be handled by the hook
        }
    }, [saveLayout]);

    return (
        <div className={`customizable-dashboard ${className}`}>
            {/* Dashboard Toolbar */}
            {enableCustomization && (
                <DashboardToolbar
                    isEditing={isEditing}
                    hasChanges={hasChanges}
                    onToggleEdit={toggleEditing}
                    onSave={handleSave}
                    onReset={resetLayout}
                    onAddWidget={handleAddWidget}
                    isLoading={isLoading}
                />
            )}

            {/* Dashboard Content */}
            <div className="p-4">
                {isLoading ? (
                    /* Loading State */
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 row-span-2">
                            <WidgetSkeleton size="full" showChart={true} />
                        </div>
                        <div className="col-span-6 row-span-1">
                            <WidgetSkeleton size="medium" showStats={true} />
                        </div>
                        <div className="col-span-6 row-span-1">
                            <WidgetSkeleton size="medium" showStats={true} />
                        </div>
                    </div>
                ) : widgets.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Dashboard Vuota
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Aggiungi widget per iniziare a monitorare la tua attività
                        </p>
                        {enableCustomization && (
                            <button
                                onClick={handleAddWidget}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Aggiungi Primo Widget</span>
                            </button>
                        )}
                    </div>
                ) : (
                    /* Widget Grid */
                    <WidgetGrid
                        widgets={widgets}
                        isEditing={isEditing}
                        onWidgetChange={updateWidget}
                        onWidgetRemove={removeWidget}
                        onWidgetRefresh={refreshWidget}
                    />
                )}
            </div>

            {/* Widget Library Modal */}
            {showWidgetLibrary && (
                <WidgetLibrary
                    onSelect={handleWidgetSelect}
                    onClose={() => setShowWidgetLibrary(false)}
                    maxWidgets={maxWidgets}
                    currentWidgetCount={widgets.length}
                />
            )}
        </div>
    );
};

export default CustomizableDashboard;
