export type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "AED" | "SAR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: { code: "PKR", symbol: "Rs", name: "Pakistani Rupee", locale: "en-PK" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", locale: "ar-AE" },
  SAR: { code: "SAR", symbol: "SAR", name: "Saudi Riyal", locale: "ar-SA" },
};

/**
 * Format an amount with currency symbol and appropriate commas
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = "PKR",
  customSymbol?: string
): string {
  if (isNaN(amount) || amount < 0) amount = 0;
  const config = CURRENCIES[currencyCode] || CURRENCIES.PKR;
  const symbol = customSymbol || config.symbol;

  const formattedNumber = Math.round(amount).toLocaleString("en-US");
  return `${symbol} ${formattedNumber}`;
}
