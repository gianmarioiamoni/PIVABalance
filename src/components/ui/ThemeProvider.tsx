"use client";

import React, { createContext, useContext } from "react";
import { useTheme, Theme } from "@/hooks/useTheme";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
}

/**
 * Theme Provider Component
 * Provides theme context to the entire application
 * Handles theme state management and persistence
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const themeHook = useTheme();

    return (
        <ThemeContext.Provider value={themeHook}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to use theme context
 * Must be used within a ThemeProvider
 */
export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }

    return context;
}; 