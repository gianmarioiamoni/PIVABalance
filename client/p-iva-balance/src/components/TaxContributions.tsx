import React from 'react';
import { TaxContributions as MigratedTaxContributions } from '@/components/tax-settings';

/**
 * Legacy TaxContributions component wrapper
 * Uses the new migrated TaxContributions component for enhanced functionality
 */
export const TaxContributions: React.FC = () => {
    return <MigratedTaxContributions />;
};
