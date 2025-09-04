/**
 * Advanced Filters Component
 * 
 * SRP: Handles ONLY advanced filtering interface for analytics
 * Advanced filtering system with multiple criteria and presets
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Filter, X, Calendar, DollarSign, Users, Tag, Search } from 'lucide-react';

/**
 * Filter Criteria Interface
 * SRP: Defines only filter criteria structure
 */
export interface FilterCriteria {
    dateRange: {
        start?: Date;
        end?: Date;
    };
    amountRange: {
        min?: number;
        max?: number;
    };
    clients: string[];
    categories: string[];
    searchQuery: string;
    preset?: FilterPreset;
}

/**
 * Filter Preset Type
 * SRP: Defines only filter preset options
 */
export type FilterPreset = 'all' | 'last-month' | 'last-quarter' | 'last-year' | 'high-value' | 'recent' | 'custom';

/**
 * Advanced Filters Props
 * SRP: Interface for advanced filters properties
 */
export interface AdvancedFiltersProps {
    criteria: FilterCriteria;
    onCriteriaChange: (criteria: FilterCriteria) => void;
    availableClients: string[];
    availableCategories: string[];
    onReset: () => void;
    onApply: () => void;
    className?: string;
}

/**
 * Filter Presets Hook
 * SRP: Handles only filter preset logic
 */
const useFilterPresets = (onCriteriaChange: (criteria: FilterCriteria) => void) => {
    const presets = useMemo(() => [
        {
            value: 'all',
            label: 'Tutti i Dati',
            criteria: {}
        },
        {
            value: 'last-month',
            label: 'Ultimo Mese',
            criteria: {
                dateRange: {
                    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    end: new Date()
                }
            }
        },
        {
            value: 'last-quarter',
            label: 'Ultimo Trimestre',
            criteria: {
                dateRange: {
                    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                    end: new Date()
                }
            }
        },
        {
            value: 'last-year',
            label: 'Ultimo Anno',
            criteria: {
                dateRange: {
                    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                    end: new Date()
                }
            }
        },
        {
            value: 'high-value',
            label: 'Alto Valore (>€1000)',
            criteria: {
                amountRange: {
                    min: 1000
                }
            }
        },
        {
            value: 'recent',
            label: 'Recenti (30gg)',
            criteria: {
                dateRange: {
                    start: new Date(new Date().setDate(new Date().getDate() - 30)),
                    end: new Date()
                }
            }
        }
    ] as { value: FilterPreset; label: string; criteria: Partial<FilterCriteria> }[], []);

    const applyPreset = useCallback((preset: FilterPreset) => {
        const presetConfig = presets.find(p => p.value === preset);
        if (presetConfig) {
            onCriteriaChange({
                dateRange: { start: undefined, end: undefined },
                amountRange: { min: undefined, max: undefined },
                clients: [],
                categories: [],
                searchQuery: '',
                preset,
                ...presetConfig.criteria
            });
        }
    }, [onCriteriaChange, presets]);

    return {
        presets,
        applyPreset
    };
};

/**
 * Date Range Filter Component
 * SRP: Handles only date range filtering UI
 */
const DateRangeFilter: React.FC<{
    dateRange: FilterCriteria['dateRange'];
    onDateRangeChange: (dateRange: FilterCriteria['dateRange']) => void;
}> = ({ dateRange, onDateRangeChange }) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 inline mr-1" />
                Periodo
            </label>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Data Inizio</label>
                    <input
                        type="date"
                        value={dateRange.start?.toISOString().split('T')[0] || ''}
                        onChange={(e) => onDateRangeChange({
                            ...dateRange,
                            start: e.target.value ? new Date(e.target.value) : undefined
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Data Fine</label>
                    <input
                        type="date"
                        value={dateRange.end?.toISOString().split('T')[0] || ''}
                        onChange={(e) => onDateRangeChange({
                            ...dateRange,
                            end: e.target.value ? new Date(e.target.value) : undefined
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Amount Range Filter Component
 * SRP: Handles only amount range filtering UI
 */
const AmountRangeFilter: React.FC<{
    amountRange: FilterCriteria['amountRange'];
    onAmountRangeChange: (amountRange: FilterCriteria['amountRange']) => void;
}> = ({ amountRange, onAmountRangeChange }) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Importo
            </label>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimo (€)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amountRange.min || ''}
                        onChange={(e) => onAmountRangeChange({
                            ...amountRange,
                            min: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Massimo (€)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amountRange.max || ''}
                        onChange={(e) => onAmountRangeChange({
                            ...amountRange,
                            max: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Illimitato"
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Multi-Select Filter Component
 * SRP: Handles only multi-select filtering UI
 */
const MultiSelectFilter: React.FC<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    selected: string[];
    options: string[];
    onSelectionChange: (selected: string[]) => void;
    placeholder: string;
}> = ({ label, icon: IconComponent, selected, options, onSelectionChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onSelectionChange(newSelected);
    };

    const clearAll = () => {
        onSelectionChange([]);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                <IconComponent className="h-4 w-4 inline mr-1" />
                {label}
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 text-sm text-left border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500"
                >
                    {selected.length === 0 ? (
                        <span className="text-gray-500">{placeholder}</span>
                    ) : (
                        <span>{selected.length} selezionati</span>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {/* Clear All */}
                        {selected.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 border-b border-gray-200"
                            >
                                <X className="h-3 w-3 inline mr-1" />
                                Cancella tutto
                            </button>
                        )}

                        {/* Options */}
                        {options.map(option => (
                            <label
                                key={option}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                    className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-900 truncate">{option}</span>
                            </label>
                        ))}

                        {options.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                Nessuna opzione disponibile
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Items */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selected.map(item => (
                        <span
                            key={item}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                            {item}
                            <button
                                onClick={() => toggleOption(item)}
                                className="ml-1 hover:text-blue-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Search Filter Component
 * SRP: Handles only search filtering UI
 */
const SearchFilter: React.FC<{
    searchQuery: string;
    onSearchChange: (query: string) => void;
}> = ({ searchQuery, onSearchChange }) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                <Search className="h-4 w-4 inline mr-1" />
                Ricerca
            </label>

            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cerca per descrizione, cliente, ecc..."
                    className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
        </div>
    );
};

/**
 * Filter Presets Component
 * SRP: Handles only filter presets UI
 */
const FilterPresets: React.FC<{
    selectedPreset?: FilterPreset;
    onPresetSelect: (preset: FilterPreset) => void;
    presets: { value: FilterPreset; label: string }[];
}> = ({ selectedPreset, onPresetSelect, presets }) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Filtri Rapidi</label>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {presets.map(preset => (
                    <button
                        key={preset.value}
                        onClick={() => onPresetSelect(preset.value)}
                        className={`px-3 py-2 text-sm rounded transition-colors ${selectedPreset === preset.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Active Filters Display Component
 * SRP: Handles only active filters display
 */
const ActiveFilters: React.FC<{
    criteria: FilterCriteria;
    onRemoveFilter: (filterType: keyof FilterCriteria, value?: string) => void;
}> = ({ criteria, onRemoveFilter }) => {
    const activeFilters = [];

    // Date range
    if (criteria.dateRange.start || criteria.dateRange.end) {
        const dateText = criteria.dateRange.start && criteria.dateRange.end
            ? `${criteria.dateRange.start.toLocaleDateString('it-IT')} - ${criteria.dateRange.end.toLocaleDateString('it-IT')}`
            : criteria.dateRange.start
                ? `Dal ${criteria.dateRange.start.toLocaleDateString('it-IT')}`
                : `Fino al ${criteria.dateRange.end?.toLocaleDateString('it-IT')}`;

        activeFilters.push({
            type: 'dateRange' as keyof FilterCriteria,
            label: `📅 ${dateText}`,
            value: undefined
        });
    }

    // Amount range
    if (criteria.amountRange.min !== undefined || criteria.amountRange.max !== undefined) {
        const amountText = criteria.amountRange.min !== undefined && criteria.amountRange.max !== undefined
            ? `€${criteria.amountRange.min} - €${criteria.amountRange.max}`
            : criteria.amountRange.min !== undefined
                ? `>€${criteria.amountRange.min}`
                : `<€${criteria.amountRange.max}`;

        activeFilters.push({
            type: 'amountRange' as keyof FilterCriteria,
            label: `💰 ${amountText}`,
            value: undefined
        });
    }

    // Clients
    criteria.clients.forEach(client => {
        activeFilters.push({
            type: 'clients' as keyof FilterCriteria,
            label: `👤 ${client}`,
            value: client
        });
    });

    // Categories
    criteria.categories.forEach(category => {
        activeFilters.push({
            type: 'categories' as keyof FilterCriteria,
            label: `🏷️ ${category}`,
            value: category
        });
    });

    // Search query
    if (criteria.searchQuery) {
        activeFilters.push({
            type: 'searchQuery' as keyof FilterCriteria,
            label: `🔍 "${criteria.searchQuery}"`,
            value: undefined
        });
    }

    if (activeFilters.length === 0) return null;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Filtri Attivi</label>
            <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                        {filter.label}
                        <button
                            onClick={() => onRemoveFilter(filter.type, filter.value)}
                            className="ml-2 hover:text-blue-600"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

/**
 * Advanced Filters Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Advanced filtering interface orchestration ONLY
 * 2. Filter criteria management ONLY
 * 3. User interaction coordination ONLY
 * 
 * NOT responsible for:
 * - Data filtering logic (handled by parent)
 * - Individual filter UI (delegated to specialized components)
 * - Filter presets logic (delegated to useFilterPresets)
 */
export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    criteria,
    onCriteriaChange,
    availableClients,
    availableCategories,
    onReset,
    onApply,
    className = ''
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Use filter presets hook
    const { presets, applyPreset } = useFilterPresets(onCriteriaChange);

    // Handle individual criteria changes
    const handleDateRangeChange = useCallback((dateRange: FilterCriteria['dateRange']) => {
        onCriteriaChange({ ...criteria, dateRange, preset: 'custom' });
    }, [criteria, onCriteriaChange]);

    const handleAmountRangeChange = useCallback((amountRange: FilterCriteria['amountRange']) => {
        onCriteriaChange({ ...criteria, amountRange, preset: 'custom' });
    }, [criteria, onCriteriaChange]);

    const handleClientsChange = useCallback((clients: string[]) => {
        onCriteriaChange({ ...criteria, clients, preset: 'custom' });
    }, [criteria, onCriteriaChange]);

    const handleCategoriesChange = useCallback((categories: string[]) => {
        onCriteriaChange({ ...criteria, categories, preset: 'custom' });
    }, [criteria, onCriteriaChange]);

    const handleSearchChange = useCallback((searchQuery: string) => {
        onCriteriaChange({ ...criteria, searchQuery, preset: 'custom' });
    }, [criteria, onCriteriaChange]);

    // Handle filter removal
    const handleRemoveFilter = useCallback((filterType: keyof FilterCriteria, value?: string) => {
        const newCriteria = { ...criteria };

        switch (filterType) {
            case 'dateRange':
                newCriteria.dateRange = { start: undefined, end: undefined };
                break;
            case 'amountRange':
                newCriteria.amountRange = { min: undefined, max: undefined };
                break;
            case 'clients':
                newCriteria.clients = value ? newCriteria.clients.filter(c => c !== value) : [];
                break;
            case 'categories':
                newCriteria.categories = value ? newCriteria.categories.filter(c => c !== value) : [];
                break;
            case 'searchQuery':
                newCriteria.searchQuery = '';
                break;
        }

        newCriteria.preset = 'custom';
        onCriteriaChange(newCriteria);
    }, [criteria, onCriteriaChange]);

    const hasActiveFilters = !!(
        criteria.dateRange.start || criteria.dateRange.end ||
        criteria.amountRange.min !== undefined || criteria.amountRange.max !== undefined ||
        criteria.clients.length > 0 || criteria.categories.length > 0 ||
        criteria.searchQuery
    );

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Filtri Avanzati</h3>
                    {hasActiveFilters && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {[
                                criteria.dateRange.start || criteria.dateRange.end ? 1 : 0,
                                criteria.amountRange.min !== undefined || criteria.amountRange.max !== undefined ? 1 : 0,
                                criteria.clients.length,
                                criteria.categories.length,
                                criteria.searchQuery ? 1 : 0
                            ].reduce((sum, count) => sum + count, 0)} attivi
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                        {isExpanded ? 'Comprimi' : 'Espandi'}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Content */}
            {isExpanded && (
                <div className="p-4 space-y-6">
                    {/* Filter Presets */}
                    <FilterPresets
                        selectedPreset={criteria.preset}
                        onPresetSelect={applyPreset}
                        presets={presets}
                    />

                    {/* Search Filter */}
                    <SearchFilter
                        searchQuery={criteria.searchQuery}
                        onSearchChange={handleSearchChange}
                    />

                    {/* Date Range Filter */}
                    <DateRangeFilter
                        dateRange={criteria.dateRange}
                        onDateRangeChange={handleDateRangeChange}
                    />

                    {/* Amount Range Filter */}
                    <AmountRangeFilter
                        amountRange={criteria.amountRange}
                        onAmountRangeChange={handleAmountRangeChange}
                    />

                    {/* Clients Filter */}
                    <MultiSelectFilter
                        label="Clienti"
                        icon={Users}
                        selected={criteria.clients}
                        options={availableClients}
                        onSelectionChange={handleClientsChange}
                        placeholder="Tutti i clienti"
                    />

                    {/* Categories Filter */}
                    <MultiSelectFilter
                        label="Categorie"
                        icon={Tag}
                        selected={criteria.categories}
                        options={availableCategories}
                        onSelectionChange={handleCategoriesChange}
                        placeholder="Tutte le categorie"
                    />

                    {/* Apply Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            onClick={onApply}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Applica Filtri
                        </button>
                    </div>
                </div>
            )}

            {/* Active Filters (always visible) */}
            {hasActiveFilters && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <ActiveFilters
                        criteria={criteria}
                        onRemoveFilter={handleRemoveFilter}
                    />
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;
