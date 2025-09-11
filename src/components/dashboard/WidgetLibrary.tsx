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
            bg-white border-2 rounded-xl p-5 transition-all duration-300 relative
            min-h-[200px] flex flex-col justify-between
            ${disabled
                ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-[1.03] cursor-pointer bg-gradient-to-br from-white to-gray-50'
            }
        `}>
            {/* Widget Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {IconComponent && (
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                            {widget.name}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                            {widget.category}
                        </p>
                    </div>
                </div>

                {/* Size Indicator */}
                <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                    {widget.defaultSize}
                </span>
            </div>

            {/* Widget Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                {widget.description}
            </p>

            {/* Supported Sizes */}
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 font-medium">Dimensioni:</span>
                    <div className="flex flex-wrap gap-1">
                        {widget.supportedSizes.map(size => (
                            <span key={size} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 font-medium">
                                {size}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Add Button - Full Width and More Prominent */}
                <button
                    onClick={onSelect}
                    disabled={disabled}
                    className={`
                        w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg
                        transition-all duration-300 shadow-sm
                        ${disabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-md transform hover:scale-105'
                        }
                    `}
                >
                    <Plus className="h-4 w-4" />
                    <span>{disabled ? 'Limite Raggiunto' : 'Aggiungi Widget'}</span>
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
    const progressPercentage = (currentWidgetCount / maxWidgets) * 100;
    
    return (
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🎯 Libreria Widget
                </h2>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-700 font-medium">
                        Scegli widget da aggiungere alla tua dashboard
                    </p>
                    <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                            {currentWidgetCount}/{maxWidgets}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-110"
            >
                <X className="h-6 w-6" />
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col ${className}`}>
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
                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    {!canAddMore && (
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Info className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-yellow-800">
                                        Limite Raggiunto
                                    </p>
                                    <p className="text-xs text-yellow-700">
                                        Hai raggiunto il limite massimo di {maxWidgets} widget. Rimuovi alcuni widget per aggiungerne di nuovi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredWidgets.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nessun widget trovato</h3>
                            <p className="text-gray-500 text-sm">Prova a modificare i filtri di ricerca</p>
                        </div>
                    ) : (
                        <div className={`
                            ${viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                : 'space-y-4'
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
                <div className="flex items-center justify-between p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Info className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                            Puoi riorganizzare i widget trascinandoli nella dashboard
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <X className="h-4 w-4" />
                        <span>Chiudi Libreria</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WidgetLibrary;
