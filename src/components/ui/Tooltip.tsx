import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TooltipProps {
    content: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    position?: 'top' | 'bottom' | 'auto';
}

/**
 * Tooltip Component
 * Enhanced tooltip with intelligent positioning, keyboard support, and smooth animations
 */
export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    className = '',
    position = 'auto'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const closeTooltip = useCallback(() => {
        setIsVisible(false);
    }, []);

    const toggleTooltip = useCallback(() => {
        setIsVisible(prev => !prev);
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                closeTooltip();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isVisible, closeTooltip]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isVisible) {
                closeTooltip();
                buttonRef.current?.focus();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isVisible, closeTooltip]);

    // Intelligent positioning
    useEffect(() => {
        if (isVisible && tooltipRef.current && buttonRef.current) {
            const tooltip = tooltipRef.current;
            const button = buttonRef.current;
            const tooltipRect = tooltip.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Reset transform
            tooltip.style.transform = 'translateX(-50%)';

            // Calculate positions
            const spaceAbove = buttonRect.top;
            const spaceBelow = viewportHeight - buttonRect.bottom;
            const tooltipHeight = tooltipRect.height;

            let finalPosition = position;
            if (position === 'auto') {
                // Auto-detect best position
                if (spaceBelow >= tooltipHeight + 8) {
                    finalPosition = 'bottom';
                } else if (spaceAbove >= tooltipHeight + 8) {
                    finalPosition = 'top';
                } else {
                    finalPosition = spaceBelow > spaceAbove ? 'bottom' : 'top';
                }
            }

            // Apply positioning
            if (finalPosition === 'top') {
                tooltip.style.top = `${buttonRect.top - tooltipHeight - 8}px`;
            } else {
                tooltip.style.top = `${buttonRect.bottom + 8}px`;
            }

            // Center horizontally but ensure it stays within viewport
            const leftPos = buttonRect.left + (buttonRect.width / 2);
            const tooltipWidth = tooltipRect.width;
            const minLeft = 16; // 16px margin from edge
            const maxLeft = viewportWidth - tooltipWidth - 16;

            tooltip.style.left = `${Math.min(Math.max(leftPos, minLeft + tooltipWidth / 2), maxLeft + tooltipWidth / 2)}px`;
        }
    }, [isVisible, position]);

    return (
        <div className={`relative inline-block ${className}`}>
            {children ? (
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={toggleTooltip}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                    aria-label="Mostra informazioni aggiuntive"
                    aria-expanded={isVisible}
                    aria-describedby={isVisible ? 'tooltip-content' : undefined}
                >
                    {children}
                </button>
            ) : (
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={toggleTooltip}
                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-colors"
                    aria-label="Mostra informazioni aggiuntive"
                    aria-expanded={isVisible}
                    aria-describedby={isVisible ? 'tooltip-content' : undefined}
                >
                    <InformationCircleIcon className="h-5 w-5" />
                </button>
            )}

            {isVisible ? (
                <div
                    ref={tooltipRef}
                    id="tooltip-content"
                    role="tooltip"
                    className="fixed z-50 px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 ease-in-out"
                    style={{
                        width: 'min(400px, 90vw)',
                        transform: 'translateX(-50%)',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}
                >
                    <div className="text-gray-700 whitespace-normal leading-relaxed">
                        {content}
                    </div>
                </div>
            ) : null}
        </div>
    );
}; 