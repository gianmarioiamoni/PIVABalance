'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SWRConfig } from 'swr';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        // Disable during SSR
        enabled: typeof window !== 'undefined',
      },
    },
  }));

  // For SSR compatibility, always provide the QueryClient but with safe defaults
  const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: typeof window !== 'undefined',
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    dedupingInterval: 2000,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={swrConfig}>
        {children}
      </SWRConfig>
    </QueryClientProvider>
  );
}
