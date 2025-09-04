/**
 * Tax Settings Components
 * Exports for components related to tax settings functionality
 * Organized by functional areas for better maintainability
 */

// Main Components
export { NavigationHandler } from "./main/NavigationHandler";
export { default as TaxSettings } from "./main/TaxSettings";

// Section Components
export { PensionContributionsSection } from "./sections/PensionContributionsSection";
export { TaxableIncomeSection } from "./sections/TaxableIncomeSection";

// INPS Components
export { InpsRateSelector } from "./inps/InpsRateSelector";
export { InpsRateOption } from "./inps/InpsRateOption";
export { InpsRateList } from "./inps/InpsRateList";

// Professional Fund Components
export { default as ProfessionalFundSelector } from "./professional-fund/ProfessionalFundSelector";
export { ProfessionalFundParameters } from "./professional-fund/ProfessionalFundParameters";

// Tax Calculations Components
export { TaxCalculationsHeader } from "./tax-calculations/TaxCalculationsHeader";
export { TaxCalculationsGrid } from "./tax-calculations/TaxCalculationsGrid";
export { default as TaxContributions } from "./tax-calculations/TaxContributions";
export { TaxEmptyState } from "./tax-calculations/TaxEmptyState";
export { TaxSummarySection } from "./tax-calculations/TaxSummarySection";

// Shared Components
export { default as ProfitabilityRateTable } from "./shared/ProfitabilityRateTable";
export { StatusMessages } from "./shared/StatusMessages";
export { TaxSettingsHeader } from "./shared/TaxSettingsHeader";
