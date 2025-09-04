/**
 * Formats a number as a currency string using the Italian locale and Euro currency
 * @param value - The number to format
 * @returns A formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

/**
 * Formats a number as a percentage string with specified decimal places
 * @param value - The number to format (e.g., 15.5 for 15.5%)
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns A formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats a number with specified decimal places and locale
 * @param value - The number to format
 * @param decimals - Number of decimal places to show (default: 0)
 * @param locale - Locale string (default: 'it-IT')
 * @returns A formatted number string
 */
export const formatNumber = (
  value: number,
  decimals: number = 0,
  locale: string = "it-IT"
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};
