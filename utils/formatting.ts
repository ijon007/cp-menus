import { CURRENCY } from "@/constants/currency";

/**
 * Formats a price string to Albanian Lek format
 * Removes any existing currency symbols and extracts number
 */
export function formatPrice(price: string): string {
  const numPrice = price.replace(/[^0-9.]/g, "");
  if (!numPrice) return CURRENCY.DEFAULT_PRICE;
  return `${numPrice} ${CURRENCY.SYMBOL}`;
}

