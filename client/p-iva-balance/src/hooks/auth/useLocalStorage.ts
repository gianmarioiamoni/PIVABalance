import { useState, useEffect } from 'react';

export function useLocalStorage(key: string, initialValue: string | null = null) {
  const [value, setValue] = useState<string | null>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(key);
    setValue(storedValue);
    setIsLoaded(true);
  }, [key]);

  const setStoredValue = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, newValue);
    }
  };

  return [value, setStoredValue, isLoaded] as const;
}
