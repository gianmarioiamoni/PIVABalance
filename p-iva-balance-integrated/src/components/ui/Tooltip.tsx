'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TooltipProps {
    content: React.ReactNode;
    children?: React.ReactNode;
    position?: 'top' | 'bottom' | 'auto';
    maxWidth?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * Tooltip Component
 * 
 * A reusable tooltip with smart positioning and accessibility features
 * 
 * @param content - Content to display in the tooltip
 * @param children - Optional custom trigger element
 * @param position - Preferred position (auto adjusts if needed)
 * @param maxWidth - Maximum width of the tooltip
 * @param className - Additional CSS classes for the trigger
 * @param disabled - Whether the tooltip is disabled
 */
export const Tooltip = ({
    content,
    children,
    position = 'auto',
    maxWidth = '500px',
    className = '',
    disabled = false
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [finalPosition, setFinalPosition] = useState<'top' | 'bottom'>('bottom');
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const calculatePosition = useCallback(() => {
        if (!tooltipRef.current || !triggerRef.current) return;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spacing = 8;

        let shouldShowAbove = false;

        if (position === 'top') {
            shouldShowAbove = true;
        } else if (position === 'bottom') {
            shouldShowAbove = false;
        } else { // auto
            const spaceBelow = viewportHeight - triggerRect.bottom - spacing;
            const spaceAbove = triggerRect.top - spacing;
            shouldShowAbove = spaceBelow < tooltipRect.height && spaceAbove > spaceBelow;
        }

        const newPosition = shouldShowAbove ? 'top' : 'bottom';
        setFinalPosition(newPosition);

        // Position the tooltip
        const left = triggerRect.left + (triggerRect.width / 2);
        const top = shouldShowAbove
            ? triggerRect.top - tooltipRect.height - spacing
            : triggerRect.bottom + spacing;

        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.top = `${top}px`;
    }, [position]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
            triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
            setIsVisible(false);
        }
    }, []);

    const handleToggle = useCallback(() => {
        if (disabled) return;
        setIsVisible(prev => !prev);
    }, [disabled]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsVisible(false);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            // Calculate position after the tooltip is rendered
            requestAnimationFrame(calculatePosition);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isVisible, handleClickOutside, calculatePosition]);

    // Recalculate position on window resize
    useEffect(() => {
        if (isVisible) {
            const handleResize = () => calculatePosition();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isVisible, calculatePosition]);

    const defaultTrigger = (
        <button
            ref={triggerRef}
            type="button"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={`ml-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-colors ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Mostra informazioni"
            aria-expanded={isVisible}
            aria-haspopup="true"
            disabled={disabled}
        >
            <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );

    return (
        <div className="relative inline-block">
            {children ? (
                <div onClick={handleToggle} className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    {children}
                </div>
            ) : (
                defaultTrigger
            )}

            {isVisible && !disabled && (
                <div
                    ref={tooltipRef}
                    className={`fixed z-50 px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity duration-200 ${finalPosition === 'top' ? 'origin-bottom' : 'origin-top'
                        }`}
                    style={{
                        width: `min(${maxWidth}, 90vw)`,
                        transform: 'translateX(-50%)',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}
                    role="tooltip"
                    aria-live="polite"
                >
                    <div className="text-gray-700 whitespace-normal">
                        {content}
                    </div>

                    {/* Arrow */}
                    <div
                        className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${finalPosition === 'top'
                                ? 'top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-white'
                                : 'bottom-full border-l-4 border-r-4 border-b-4 border-transparent border-b-white'
                            }`}
                    />
                </div>
            )}
        </div>
    );
}; 