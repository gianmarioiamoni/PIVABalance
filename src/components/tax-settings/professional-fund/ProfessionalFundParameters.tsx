import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ProfessionalFund, ProfessionalFundParameters as IProfessionalFundParameters } from '@/services/professionalFundService';
import { formatCurrency } from '@/utils/formatters';

/**
 * Props for ProfessionalFundParameters component
 */
interface ProfessionalFundParametersProps {
    fund: ProfessionalFund;
    parameters: IProfessionalFundParameters;
    parametersId?: string;
    className?: string;
}

/**
 * Professional Fund Parameters Display Component
 * 
 * Follows Single Responsibility Principle - only handles parameters display.
 * Provides consistent formatting and styling for fund parameters.
 * 
 * Features:
 * - Responsive grid layout for parameters
 * - Consistent currency formatting
 * - Conditional display of optional parameters
 * - Manual edit notification
 * - Proper accessibility with ARIA labels
 * - Mobile-first responsive design
 * 
 * @param fund - Professional fund data
 * @param parameters - Current parameters for the fund
 * @param parametersId - ID for accessibility
 * @param className - Additional CSS classes
 */
export const ProfessionalFundParameters: React.FC<ProfessionalFundParametersProps> = ({
    fund,
    parameters,
    parametersId,
    className = ""
}) => {
    return (
        <div
            id={parametersId}
            className={`mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}
            role="region"
            aria-label="Parametri contributivi correnti"
        >
            {/* Header */}
            <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <InformationCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                Parametri contributivi {parameters.year}
            </h4>

            {/* Parameters grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {/* Contribution rate */}
                <div className="space-y-1">
                    <span className="font-medium text-blue-800">Aliquota contributiva:</span>
                    <div className="text-blue-900">{parameters.contributionRate}%</div>
                </div>

                {/* Minimum contribution */}
                <div className="space-y-1">
                    <span className="font-medium text-blue-800">Contributo minimo:</span>
                    <div className="text-blue-900">
                        {formatCurrency(parameters.minimumContribution)}
                    </div>
                </div>

                {/* Fixed annual contributions (conditional) */}
                {parameters.fixedAnnualContributions > 0 && (
                    <div className="space-y-1">
                        <span className="font-medium text-blue-800">Contributi fissi annui:</span>
                        <div className="text-blue-900">
                            {formatCurrency(parameters.fixedAnnualContributions)}
                        </div>
                    </div>
                )}
            </div>

            {/* Manual edit notification */}
            {fund.allowManualEdit && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    <InformationCircleIcon className="h-3 w-3 inline mr-1" aria-hidden="true" />
                    Questa cassa consente la modifica manuale dei parametri contributivi
                </div>
            )}
        </div>
    );
}; 