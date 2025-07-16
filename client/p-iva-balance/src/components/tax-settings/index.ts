// Tax Settings Components
export { StatusMessages } from './StatusMessages';
export { NavigationHandler } from './NavigationHandler';
export { TaxableIncomeSection } from './TaxableIncomeSection';
export { InpsRateSelector } from './InpsRateSelector';
export { default as ProfitabilityRateTable } from './ProfitabilityRateTable';
export { PensionContributionsSection } from './PensionContributionsSection';
export { default as ProfessionalFundSelector } from './ProfessionalFundSelector';
export { default as TaxSettings } from './TaxSettings';
export { default as TaxContributions } from './TaxContributions';

// Export types for external use
export type { 
  StatusMessageProps,
  NavigationHandlerProps,
  TaxableIncomeSectionProps,
  InpsRateSelectorProps,
  ProfitabilityRateTableProps,
  PensionContributionsSectionProps,
} from './types';
