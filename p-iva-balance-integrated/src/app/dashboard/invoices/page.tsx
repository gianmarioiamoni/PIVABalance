'use client';

import { Suspense } from 'react';
import Invoices from '@/components/invoices/Invoices';
import { LoadingSpinner } from '@/components/ui';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

export default function InvoicesPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Invoices />
        </Suspense>
    );
} 