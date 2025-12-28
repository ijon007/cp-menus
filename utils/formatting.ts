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

/**
 * Formats a timestamp to a date string for mobile (month and day only)
 * e.g., "Dec 28"
 */
export function formatOrderDateMobile(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a timestamp to a full date string with time for desktop
 * e.g., "Dec 28, 2025, 06:27 PM"
 */
export function formatOrderDateDesktop(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

