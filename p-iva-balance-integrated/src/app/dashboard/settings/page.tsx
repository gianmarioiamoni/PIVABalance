'use client';

import { useRef } from 'react';
import TaxSettings from '@/components/tax-settings/main/TaxSettings';

export default function SettingsPage() {
    const taxSettingsRef = useRef<{ hasChanges: () => boolean } | null>(null);

    return (
        <div>
            <TaxSettings
                ref={taxSettingsRef}
                activeTab="settings"
                attemptedTab={undefined}
                onTabChange={() => { }}
                onCancelTabChange={() => { }}
            />
        </div>
    );
} 