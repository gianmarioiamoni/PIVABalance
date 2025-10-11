import { renderHook, act } from '@testing-library/react';
import { useRetry } from '../../src/hooks/useRetry';

// Mock setTimeout for testing
jest.useFakeTimers();

describe('useRetry Hook', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should execute function successfully on first attempt', async () => {
    const { result } = renderHook(() => useRetry());
    const mockFn = jest.fn().mockResolvedValue('success');

    let executeResult: string;
    await act(async () => {
      executeResult = await result.current.execute(mockFn);
    });

    expect(executeResult!).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetrying).toBe(false);
  });

  it('should retry on failure up to maxRetries', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 2, delay: 100 }));
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    let executePromise: Promise<string>;
    act(() => {
      executePromise = result.current.execute(mockFn);
    });

    // Fast-forward through delays
    await act(async () => {
      jest.advanceTimersByTime(100);
      jest.advanceTimersByTime(100);
      await executePromise;
    });

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(result.current.retryCount).toBe(0); // Reset after success
    expect(result.current.isRetrying).toBe(false);
  });

  it('should throw error after maxRetries exceeded', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 2, delay: 100 }));
    const error = new Error('Persistent failure');
    const mockFn = jest.fn().mockRejectedValue(error);

    let thrownError: Error | undefined;
    let executePromise: Promise<string>;

    act(() => {
      executePromise = result.current.execute(mockFn).catch((err) => {
        thrownError = err;
        throw err;
      });
    });

    await act(async () => {
      jest.advanceTimersByTime(100);
      jest.advanceTimersByTime(100);
      try {
        await executePromise;
      } catch {
        // Expected to throw
      }
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(thrownError).toBe(error);
    expect(result.current.isRetrying).toBe(false);
  });

  it('should use exponential backoff when enabled', async () => {
    const { result } = renderHook(() => 
      useRetry({ maxRetries: 3, delay: 100, exponentialBackoff: true })
    );
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    let executePromise: Promise<string>;
    act(() => {
      executePromise = result.current.execute(mockFn);
    });

    await act(async () => {
      // First retry: 100ms
      jest.advanceTimersByTime(100);
      // Second retry: 200ms (exponential backoff)
      jest.advanceTimersByTime(200);
      await executePromise;
    });

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should reset retry state correctly', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 2 }));
    const mockFn = jest.fn().mockRejectedValue(new Error('Failure'));

    // Start execution that will fail
    act(() => {
      result.current.execute(mockFn).catch(() => {});
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(1000);
    });

    // Reset state
    act(() => {
      result.current.reset();
    });

    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetrying).toBe(false);
  });

  it('should handle different retry options correctly', () => {
    const { result: defaultResult } = renderHook(() => useRetry());
    const { result: customResult } = renderHook(() => 
      useRetry({ maxRetries: 5, delay: 500, exponentialBackoff: false })
    );

    expect(defaultResult.current.retryCount).toBe(0);
    expect(customResult.current.retryCount).toBe(0);
    expect(defaultResult.current.isRetrying).toBe(false);
    expect(customResult.current.isRetrying).toBe(false);
  });
});
