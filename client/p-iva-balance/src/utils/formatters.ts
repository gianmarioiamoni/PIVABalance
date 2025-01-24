/**
 * Formats a number as a currency string using the Italian locale and Euro currency
 * @param value - The number to format
 * @returns A formatted currency string
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};
