import React from 'react';
import { InpsParameters, InpsRate } from '@/services/inpsService';
import { InpsRateOption } from './InpsRateOption';

/**
 * Props for InpsRateList component
 */
interface InpsRateListProps {
    parameters: InpsParameters;
    selectedValue?: string;
    onRateSelect: (rate: InpsRate) => void;
    className?: string;
}

/**
 * INPS Rate List Component
 * 
 * Follows Single Responsibility Principle - only handles rate list display and management.
 * Provides proper accessibility with semantic radio group and ARIA attributes.
 * 
 * Features:
 * - Semantic radio group for accessibility
 * - Keyboard navigation between options
 * - Screen reader friendly with proper labels
 * - Arrow key navigation
 * - Space/Enter key selection
 * 
 * @param parameters - INPS parameters with rates and contributions
 * @param selectedValue - Currently selected rate type
 * @param onRateSelect - Callback when a rate is selected
 * @param className - Additional CSS classes
 */
export const InpsRateList: React.FC<InpsRateListProps> = ({
    parameters,
    selectedValue,
    onRateSelect,
    className = ""
}) => {
    const radioGroupName = React.useId();
    const groupId = `inps-rates-${radioGroupName}`;

    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
        const rates = parameters.rates;
        let nextIndex = currentIndex;

        // Arrow key navigation
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % rates.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                nextIndex = currentIndex === 0 ? rates.length - 1 : currentIndex - 1;
                break;
            case 'Home':
                e.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                nextIndex = rates.length - 1;
                break;
            default:
                return; // Don't handle other keys
        }

        // Focus the next option
        const nextOptionId = `inps-rate-${rates[nextIndex].type}`;
        const nextElement = document.getElementById(nextOptionId);
        if (nextElement) {
            nextElement.focus();
        }
    };

    return (
        <div
            className={`space-y-4 ${className}`}
            role="radiogroup"
            aria-labelledby={groupId}
        >
            {/* Screen reader heading */}
            <div id={groupId} className="sr-only">
                Selezione aliquota INPS
            </div>

            <div className="grid gap-4">
                {parameters.rates.map((rate, index) => (
                    <div
                        key={rate.type}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                        <InpsRateOption
                            rate={rate}
                            minContribution={parameters.minContributions[rate.type] || 0}
                            isSelected={selectedValue === rate.type}
                            onSelect={onRateSelect}
                            name={radioGroupName}
                        />
                    </div>
                ))}
            </div>

            {/* Instructions for screen readers */}
            <div className="sr-only" aria-live="polite">
                {parameters.rates.length} opzioni disponibili.
                Usa le frecce per navigare e spazio per selezionare.
            </div>
        </div>
    );
}; 