"use client";

import React, { useState } from "react";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "./ThemeProvider";

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
    variant?: "icon" | "button" | "dropdown";
}

/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 * Supports multiple variants for different UI contexts
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = "",
    showLabel = false,
    variant = "icon"
}) => {
    const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const themes = [
        {
            value: "light" as const,
            label: "Tema Chiaro",
            icon: SunIcon,
        },
        {
            value: "dark" as const,
            label: "Tema Scuro",
            icon: MoonIcon,
        },
        {
            value: "system" as const,
            label: "Sistema",
            icon: ComputerDesktopIcon,
        },
    ];

    const currentThemeConfig = themes.find(t => t.value === theme) || themes[0];
    const CurrentIcon = currentThemeConfig.icon;

    if (variant === "icon") {
        return (
            <button
                onClick={toggleTheme}
                className={`btn-secondary p-2 ${className}`}
                aria-label={`Cambia tema. Attuale: ${currentThemeConfig.label}`}
                title={`Cambia tema. Attuale: ${currentThemeConfig.label}`}
            >
                <CurrentIcon className="h-5 w-5" />
                {showLabel && (
                    <span className="ml-2 text-sm">{currentThemeConfig.label}</span>
                )}
            </button>
        );
    }

    if (variant === "button") {
        return (
            <button
                onClick={toggleTheme}
                className={`btn-secondary px-4 py-2 ${className}`}
                aria-label={`Cambia tema. Attuale: ${currentThemeConfig.label}`}
            >
                <CurrentIcon className="h-5 w-5" />
                <span className="ml-2">{currentThemeConfig.label}</span>
            </button>
        );
    }

    // Dropdown variant
    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn-secondary p-2"
                aria-label="Menu tema"
                aria-expanded={isDropdownOpen}
            >
                <CurrentIcon className="h-5 w-5" />
                {showLabel && (
                    <span className="ml-2 text-sm">{currentThemeConfig.label}</span>
                )}
            </button>

            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 z-20 card animate-fade-in">
                        <div className="py-1">
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon;
                                const isSelected = theme === themeOption.value;

                                return (
                                    <button
                                        key={themeOption.value}
                                        onClick={() => {
                                            setTheme(themeOption.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-surface-hover transition-colors ${isSelected ? "bg-surface-secondary" : ""
                                            }`}
                                    >
                                        <Icon className="h-4 w-4 mr-3" />
                                        <span>{themeOption.label}</span>
                                        {isSelected && (
                                            <div className="ml-auto w-2 h-2 bg-brand-primary rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Current resolved theme indicator */}
                        <div className="px-4 py-2 border-t border-surface-border">
                            <div className="text-xs text-tertiary">
                                Tema corrente: {resolvedTheme === "light" ? "Chiaro" : "Scuro"}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}; 