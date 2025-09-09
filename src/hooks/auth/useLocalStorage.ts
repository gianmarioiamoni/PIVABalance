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
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    // Try to load immediately on initialization (client-side only)
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        console.log(
          `🔍 useLocalStorage(${key}) - Initial load, item:`,
          item ? "EXISTS" : "NULL"
        );
        if (item !== null) {
          try {
            return JSON.parse(item);
          } catch {
            return item as T;
          }
        }
      } catch (error) {
        console.error(
          `🔍 useLocalStorage(${key}) - Initial load error:`,
          error
        );
      }
    }
    return initialValue || null;
  });

  const [isLoaded, setIsLoaded] = useState(() => {
    // FORCE isLoaded to true to bypass hydration issues
    return true;
  });

  // Fallback: ensure isLoaded becomes true after a timeout (removed as no longer needed)
  // useEffect removed since isLoaded is now initialized to true directly

  // Load value from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          // Try to parse as JSON, but if it fails, use the raw string
          // This handles both JSON objects and raw strings like JWT tokens
          try {
            setStoredValue(JSON.parse(item));
          } catch (_jsonError) {
            // If JSON.parse fails, it's likely a raw string (like JWT token)
            setStoredValue(item as T);
          }
        } else if (initialValue !== undefined) {
          setStoredValue(initialValue);
        }
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      if (initialValue !== undefined) {
        setStoredValue(initialValue);
      }
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
            // Store strings directly, JSON.stringify for objects
            const valueToStore =
              typeof value === "string" ? value : JSON.stringify(value);
            window.localStorage.setItem(key, valueToStore);
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
