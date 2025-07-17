'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          errorRetryCount: 3,
          errorRetryInterval: 1000,
          dedupingInterval: 2000,
        }}
      >
        {children}
      </SWRConfig>
    </QueryClientProvider>
  );
}
