import React from 'react';

interface TaxRegimeInfoProps {
    taxRegime: string;
    invoiceCount: number;
    isLoading: boolean;
}

/**
 * TaxRegimeInfo Component
 * 
 * Displays information about tax regime when applicable
 * Follows SRP by handling only tax regime information display
 */
export const TaxRegimeInfo: React.FC<TaxRegimeInfoProps> = ({
    taxRegime,
    invoiceCount,
    isLoading
}) => {
    // Only show for forfettario regime with no invoices
    if (taxRegime !== 'forfettario' || invoiceCount > 0 || isLoading) {
        return null;
    }

    return (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                        Regime Forfettario
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                        <p>
                            Con il regime forfettario non è necessario applicare l&apos;IVA alle fatture.
                            Le fatture saranno automaticamente gestite secondo le normative del regime forfettario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 