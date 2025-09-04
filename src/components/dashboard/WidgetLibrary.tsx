/**
 * Widget Library Component
 * 
 * SRP: Handles ONLY widget selection and preview interface
 * Modal for browsing and selecting widgets to add to dashboard
 */

'use client';

import React, { useState } from 'react';
import { X, Search, Grid, List, Plus, Info } from 'lucide-react';
import { WidgetRegistry } from '../widgets/registry/WidgetRegistry';
import { WidgetRegistryEntry } from '../widgets/base/types';

/**
 * Widget Library Props
 * SRP: Interface for widget library specific properties
 */
export interface WidgetLibraryProps {
    onSelect: (widgetType: string) => void;
    onClose: () => void;
    maxWidgets: number;
    currentWidgetCount: number;
    className?: string;
}

/**
 * Widget Category Filter Component
 * SRP: Handles only category filtering UI
 */
const CategoryFilter: React.FC<{
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}> = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={() => onCategoryChange('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                Tutti
            </button>
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

/**
 * Widget Card Component
 * SRP: Handles only widget preview card rendering
 */
const WidgetCard: React.FC<{
    widget: WidgetRegistryEntry;
    onSelect: () => void;
    disabled?: boolean;
}> = ({ widget, onSelect, disabled = false }) => {
    const IconComponent = widget.icon;

    return (
        <div className={`
      bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 cursor-pointer
      ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-blue-300 hover:shadow-md hover:scale-[1.02]'
            }
    `}>
            {/* Widget Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    {IconComponent && (
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                            {widget.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {widget.category}
                        </p>
                    </div>
                </div>

                {/* Size Indicator */}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {widget.defaultSize}
                </span>
            </div>

            {/* Widget Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {widget.description}
            </p>

            {/* Supported Sizes */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Dimensioni:</span>
                    <div className="flex space-x-1">
                        {widget.supportedSizes.map(size => (
                            <span key={size} className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded">
                                {size}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Add Button */}
                <button
                    onClick={onSelect}
                    disabled={disabled}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="h-3 w-3" />
                    <span>Aggiungi</span>
                </button>
            </div>
        </div>
    );
};

/**
 * Widget Search Hook
 * SRP: Handles only search and filtering logic
 */
const useWidgetSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const allWidgets = WidgetRegistry.getAll();
    const categories = WidgetRegistry.getCategories();

    const filteredWidgets = allWidgets.filter(widget => {
        const matchesSearch = searchQuery === '' ||
            widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            widget.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' ||
            widget.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredWidgets,
        categories
    };
};

/**
 * Widget Library Header Component
 * SRP: Handles only modal header rendering
 */
const WidgetLibraryHeader: React.FC<{
    currentWidgetCount: number;
    maxWidgets: number;
    onClose: () => void;
}> = ({ currentWidgetCount, maxWidgets, onClose }) => {
    return (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Libreria Widget
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Scegli widget da aggiungere alla tua dashboard ({currentWidgetCount}/{maxWidgets})
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
};

/**
 * Widget Search Controls Component
 * SRP: Handles only search and filter UI
 */
const WidgetSearchControls: React.FC<{
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    resultCount: number;
}> = ({
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    resultCount
}) => {
        return (
            <div className="p-6 border-b border-gray-100">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cerca widget..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Category Filter */}
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        {resultCount} widget disponibili
                    </div>

                    <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                }`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

/**
 * Widget Library Component (Client-Side Modal)
 * 
 * SRP Responsibilities:
 * 1. Modal container and layout ONLY
 * 2. Widget library orchestration ONLY
 * 
 * NOT responsible for:
 * - Widget implementation logic
 * - Dashboard layout management  
 * - Search/filter logic (delegated to useWidgetSearch)
 * - Header rendering (delegated to WidgetLibraryHeader)
 * - Search controls (delegated to WidgetSearchControls)
 */
export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({
    onSelect,
    onClose,
    maxWidgets,
    currentWidgetCount,
    className = ''
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredWidgets,
        categories
    } = useWidgetSearch();

    const canAddMore = currentWidgetCount < maxWidgets;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden ${className}`}>
                {/* Header */}
                <WidgetLibraryHeader
                    currentWidgetCount={currentWidgetCount}
                    maxWidgets={maxWidgets}
                    onClose={onClose}
                />

                {/* Search and Filters */}
                <WidgetSearchControls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    resultCount={filteredWidgets.length}
                />

                {/* Widget List */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {!canAddMore && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-700">
                                    Hai raggiunto il limite massimo di {maxWidgets} widget
                                </span>
                            </div>
                        </div>
                    )}

                    {filteredWidgets.length === 0 ? (
                        <div className="text-center py-8">
                            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Nessun widget trovato</p>
                        </div>
                    ) : (
                        <div className={`
              ${viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                                : 'space-y-3'
                            }
            `}>
                            {filteredWidgets.map(widget => (
                                <WidgetCard
                                    key={widget.id}
                                    widget={widget}
                                    onSelect={() => onSelect(widget.id)}
                                    disabled={!canAddMore}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                        Puoi riorganizzare i widget trascinandoli nella dashboard
                    </p>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WidgetLibrary;
