/**
 * Advanced Filters Hook
 *
 * SRP: Handles ONLY advanced filtering logic and state management
 * Advanced filtering system for analytics data
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { FilterCriteria } from "@/components/analytics/AdvancedFilters";

/**
 * Filterable Data Interface
 * SRP: Defines only filterable data structure
 */
export interface FilterableData {
  id: string;
  date: string;
  amount: number;
  description?: string;
  clientName?: string;
  category?: string;
  [key: string]: unknown;
}

/**
 * Filter Statistics Interface
 * SRP: Defines only filter statistics structure
 */
export interface FilterStatistics {
  totalItems: number;
  filteredItems: number;
  filterEfficiency: number;
  appliedFilters: number;
}

/**
 * Data Filter Service
 * SRP: Handles only data filtering operations
 */
class DataFilterService {
  /**
   * Apply Date Range Filter
   * SRP: Filters only by date range
   */
  static filterByDateRange(
    data: FilterableData[],
    dateRange: FilterCriteria["dateRange"]
  ): FilterableData[] {
    if (!dateRange.start && !dateRange.end) {
      return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item.date);

      if (dateRange.start && itemDate < dateRange.start) {
        return false;
      }

      if (dateRange.end && itemDate > dateRange.end) {
        return false;
      }

      return true;
    });
  }

  /**
   * Apply Amount Range Filter
   * SRP: Filters only by amount range
   */
  static filterByAmountRange(
    data: FilterableData[],
    amountRange: FilterCriteria["amountRange"]
  ): FilterableData[] {
    if (amountRange.min === undefined && amountRange.max === undefined) {
      return data;
    }

    return data.filter((item) => {
      if (amountRange.min !== undefined && item.amount < amountRange.min) {
        return false;
      }

      if (amountRange.max !== undefined && item.amount > amountRange.max) {
        return false;
      }

      return true;
    });
  }

  /**
   * Apply Clients Filter
   * SRP: Filters only by client selection
   */
  static filterByClients(
    data: FilterableData[],
    clients: string[]
  ): FilterableData[] {
    if (clients.length === 0) {
      return data;
    }

    return data.filter(
      (item) => item.clientName && clients.includes(item.clientName)
    );
  }

  /**
   * Apply Categories Filter
   * SRP: Filters only by category selection
   */
  static filterByCategories(
    data: FilterableData[],
    categories: string[]
  ): FilterableData[] {
    if (categories.length === 0) {
      return data;
    }

    return data.filter(
      (item) => item.category && categories.includes(item.category)
    );
  }

  /**
   * Apply Search Query Filter
   * SRP: Filters only by search query
   */
  static filterBySearchQuery(
    data: FilterableData[],
    searchQuery: string
  ): FilterableData[] {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();

    return data.filter((item) => {
      const searchableFields = [
        item.description,
        item.clientName,
        item.category,
        item.amount?.toString(),
      ].filter(Boolean);

      return searchableFields.some((field) =>
        field?.toString().toLowerCase().includes(query)
      );
    });
  }

  /**
   * Apply All Filters
   * SRP: Orchestrates only complete filtering process
   */
  static applyAllFilters(
    data: FilterableData[],
    criteria: FilterCriteria
  ): FilterableData[] {
    let filteredData = data;

    // Apply filters in sequence
    filteredData = this.filterByDateRange(filteredData, criteria.dateRange);
    filteredData = this.filterByAmountRange(filteredData, criteria.amountRange);
    filteredData = this.filterByClients(filteredData, criteria.clients);
    filteredData = this.filterByCategories(filteredData, criteria.categories);
    filteredData = this.filterBySearchQuery(filteredData, criteria.searchQuery);

    return filteredData;
  }
}

/**
 * Advanced Filters Hook
 * SRP: Handles only advanced filtering state and operations
 */
export const useAdvancedFilters = (
  data: FilterableData[],
  initialCriteria?: Partial<FilterCriteria>
) => {
  // Initialize filter criteria
  const [criteria, setCriteria] = useState<FilterCriteria>({
    dateRange: { start: undefined, end: undefined },
    amountRange: { min: undefined, max: undefined },
    clients: [],
    categories: [],
    searchQuery: "",
    preset: "all",
    ...initialCriteria,
  });

  // Extract available options from data
  const availableOptions = useMemo(() => {
    const clients = [
      ...new Set(data.map((item) => item.clientName).filter(Boolean)),
    ] as string[];
    const categories = [
      ...new Set(data.map((item) => item.category).filter(Boolean)),
    ] as string[];

    return {
      clients: clients.sort(),
      categories: categories.sort(),
    };
  }, [data]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return DataFilterService.applyAllFilters(data, criteria);
  }, [data, criteria]);

  // Calculate filter statistics
  const statistics = useMemo((): FilterStatistics => {
    const totalItems = data.length;
    const filteredItems = filteredData.length;
    const filterEfficiency =
      totalItems > 0 ? (filteredItems / totalItems) * 100 : 100;

    const appliedFilters = [
      criteria.dateRange.start || criteria.dateRange.end ? 1 : 0,
      criteria.amountRange.min !== undefined ||
      criteria.amountRange.max !== undefined
        ? 1
        : 0,
      criteria.clients.length > 0 ? 1 : 0,
      criteria.categories.length > 0 ? 1 : 0,
      criteria.searchQuery ? 1 : 0,
    ].reduce((sum, count) => sum + count, 0);

    return {
      totalItems,
      filteredItems,
      filterEfficiency,
      appliedFilters,
    };
  }, [data.length, filteredData.length, criteria]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setCriteria({
      dateRange: { start: undefined, end: undefined },
      amountRange: { min: undefined, max: undefined },
      clients: [],
      categories: [],
      searchQuery: "",
      preset: "all",
    });
  }, []);

  // Apply filters (for external triggers)
  const applyFilters = useCallback(() => {
    // This could trigger analytics refresh or other actions
    // For now, it's just a placeholder for external integration
  }, []);

  return {
    criteria,
    setCriteria,
    filteredData,
    availableClients: availableOptions.clients,
    availableCategories: availableOptions.categories,
    statistics,
    resetFilters,
    applyFilters,

    // Individual filter functions for advanced usage
    filterByDateRange: (dateRange: FilterCriteria["dateRange"]) =>
      DataFilterService.filterByDateRange(data, dateRange),
    filterByAmountRange: (amountRange: FilterCriteria["amountRange"]) =>
      DataFilterService.filterByAmountRange(data, amountRange),
    filterByClients: (clients: string[]) =>
      DataFilterService.filterByClients(data, clients),
    filterByCategories: (categories: string[]) =>
      DataFilterService.filterByCategories(data, categories),
    filterBySearchQuery: (searchQuery: string) =>
      DataFilterService.filterBySearchQuery(data, searchQuery),
  };
};
