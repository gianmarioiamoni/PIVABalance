"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for localStorage with SSR safety and TypeScript support
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if no value exists in localStorage
 * @returns [value, setValue, isLoaded] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T | null, (value: T | null) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load value from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        } else if (initialValue !== undefined) {
          setStoredValue(initialValue);
        }
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      if (initialValue !== undefined) {
        setStoredValue(initialValue);
      }
    } finally {
      setIsLoaded(true);
    }
  }, [key, initialValue]);

  // Set value in localStorage and state
  const setValue = useCallback(
    (value: T | null) => {
      try {
        setStoredValue(value);

        if (typeof window !== "undefined") {
          if (value === null) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(value));
          }
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue, isLoaded];
}
