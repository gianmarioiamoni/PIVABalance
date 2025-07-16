import React, { forwardRef } from 'react';
import { TaxSettings as MigratedTaxSettings } from '@/components/tax-settings';

interface TaxSettingsProps {
  activeTab: string;
  attemptedTab: string | undefined;
  onTabChange: (newTab: string) => void;
  onCancelTabChange: () => void;
}

/**
 * Legacy TaxSettings component wrapper
 * Uses the new migrated TaxSettings component for enhanced functionality
 */
const TaxSettings = forwardRef<{ hasChanges: () => boolean }, TaxSettingsProps>(
  (props, ref) => {
    return <MigratedTaxSettings ref={ref} {...props} />;
  }
);

TaxSettings.displayName = 'TaxSettings';

export default TaxSettings;
