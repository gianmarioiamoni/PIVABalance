import { useState, useCallback, useMemo } from "react";

/**
 * Hook for managing year selection in tax calculations
 *
 * Follows Single Responsibility Principle - only handles year selection logic.
 * Provides available years generation and selection management.
 *
 * @param defaultYear - Initial year to select
 * @returns Object with year state and handlers
 */
export const useYearSelection = (defaultYear?: number) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    defaultYear || new Date().getFullYear()
  );

  /**
   * Generate available years for selection
   * Starting from 2020 up to current year (no future years)
   * Memoized to prevent unnecessary recalculations
   */
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // Start from 2020 for historical data
    const endYear = currentYear; // No future years to match API validation

    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    ).reverse(); // Most recent years first
  }, []);

  /**
   * Handle year selection with validation
   * Ensures only valid years can be selected
   */
  const handleYearChange = useCallback(
    (year: number | string) => {
      const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;

      if (availableYears.includes(yearNumber)) {
        setSelectedYear(yearNumber);
        return true;
      }
      return false;
    },
    [availableYears]
  );

  /**
   * Handle year change from select element
   */
  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      handleYearChange(event.target.value);
    },
    [handleYearChange]
  );

  return {
    selectedYear,
    availableYears,
    handleYearChange,
    handleSelectChange,
    setSelectedYear,
  };
};
