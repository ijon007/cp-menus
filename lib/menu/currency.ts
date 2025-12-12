import type { Currency } from "@/lib/menu/types"

// Cache for exchange rates (valid for 1 hour)
let exchangeRatesCache: {
  rates: Record<string, number>
  timestamp: number
} | null = null

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

const EXCHANGE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD"

export async function getExchangeRates(): Promise<Record<string, number>> {
  // Return cached rates if still valid
  if (
    exchangeRatesCache &&
    Date.now() - exchangeRatesCache.timestamp < CACHE_DURATION
  ) {
    return exchangeRatesCache.rates
  }

  try {
    const response = await fetch(EXCHANGE_API_URL)
    const data = await response.json()
    const rates = data.rates as Record<string, number>
    
    // Cache the rates
    exchangeRatesCache = {
      rates,
      timestamp: Date.now(),
    }
    
    return rates
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error)
    // Return fallback rates if API fails
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
    }
  }
}

export function convertPrice(
  price: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: Record<string, number>
): number {
  if (toCurrency === "ALL") return price
  if (fromCurrency === toCurrency) return price

  // Convert from source currency to USD first
  const usdPrice = fromCurrency === "USD" ? price : price / rates[fromCurrency]
  
  // Convert from USD to target currency
  const convertedPrice = toCurrency === "USD" ? usdPrice : usdPrice * rates[toCurrency]
  
  return convertedPrice
}

export function formatPrice(price: number, currency: Currency): string {
  if (currency === "ALL") {
    return `${price.toFixed(0)} Lek`
  }

  const symbols: Record<Currency, string> = {
    ALL: "",
    USD: "$",
    EUR: "€",
    GBP: "£",
  }

  const symbol = symbols[currency]
  return `${symbol}${price.toFixed(2)}`
}

