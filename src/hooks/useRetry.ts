import { useState, useCallback } from 'react';

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  exponentialBackoff?: boolean;
}

export interface UseRetryReturn<T> {
  execute: (fn: () => Promise<T>) => Promise<T>;
  isRetrying: boolean;
  retryCount: number;
  reset: () => void;
}

/**
 * Custom hook for handling operations with automatic retry logic
 * Provides exponential backoff and configurable retry attempts
 * 
 * @param options - Configuration for retry behavior
 * @returns Object with execute function and retry state
 * 
 * @example
 * ```tsx
 * const { execute, isRetrying, retryCount } = useRetry({
 *   maxRetries: 3,
 *   delay: 1000,
 *   exponentialBackoff: true
 * });
 * 
 * const handleApiCall = async () => {
 *   try {
 *     const result = await execute(() => apiService.getData());
 *     setData(result);
 *   } catch (error) {
 *     handleError(error);
 *   }
 * };
 * ```
 */
export const useRetry = <T = unknown>(options: RetryOptions = {}): UseRetryReturn<T> => {
  const {
    maxRetries = 3,
    delay = 1000,
    exponentialBackoff = true
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
  }, []);

  const execute = useCallback(
    async (fn: () => Promise<T>): Promise<T> => {
      let currentAttempt = 0;
      setIsRetrying(false);
      setRetryCount(0);

      const attemptExecution = async (): Promise<T> => {
        try {
          const result = await fn();
          reset();
          return result;
        } catch (error) {
          currentAttempt++;
          setRetryCount(currentAttempt);

          if (currentAttempt >= maxRetries) {
            setIsRetrying(false);
            throw error;
          }

          setIsRetrying(true);

          // Calculate delay with optional exponential backoff
          const currentDelay = exponentialBackoff 
            ? delay * Math.pow(2, currentAttempt - 1)
            : delay;

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, currentDelay));

          return attemptExecution();
        }
      };

      return attemptExecution();
    },
    [maxRetries, delay, exponentialBackoff, reset]
  );

  return {
    execute,
    isRetrying,
    retryCount,
    reset
  };
};
