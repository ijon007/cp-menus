"use client"

import * as React from "react"

import { resolveTheme } from "@/lib/menu/themes"
import { useMenuStore } from "@/lib/menu/useMenuStore"
import { MinimalMenu } from "@/components/menu/layouts/MinimalMenu"
import { ModernCardMenu } from "@/components/menu/layouts/ModernCardMenu"
import { getExchangeRates, convertPrice, formatPrice } from "@/lib/menu/currency"
import type { Currency } from "@/lib/menu/types"

export function MenuRenderer({ restaurantSlug }: { restaurantSlug: string }) {
  const store = useMenuStore()

  const restaurant = React.useMemo(() => {
    if (!store.state) return null
    return store.state.restaurants.find((r) => r.slug === restaurantSlug) ?? null
  }, [store.state, restaurantSlug])

  const menu = React.useMemo(() => {
    if (!store.state || !restaurant) return null
    const menuId = restaurant.menuIds[0]
    if (!menuId) return null
    return store.state.menus.find((m) => m.id === menuId) ?? null
  }, [store.state, restaurant])

  const theme = React.useMemo(() => {
    if (!restaurant) return resolveTheme("coffeePastel")
    return resolveTheme(restaurant.themePresetId as never, restaurant.themeOverrides)
  }, [restaurant])

  const [exchangeRates, setExchangeRates] = React.useState<Record<string, number> | null>(null)

  React.useEffect(() => {
    getExchangeRates().then(setExchangeRates)
  }, [])

  // Convert menu prices based on restaurant currency
  // This hook must be called before any early returns to maintain hook order
  const convertedMenu = React.useMemo(() => {
    if (!menu || !exchangeRates || !restaurant) return menu

    const targetCurrency = restaurant.currency
    const baseCurrency: Currency = "USD" // Assume prices are stored in USD

    if (targetCurrency === "ALL" || targetCurrency === baseCurrency) {
      return menu
    }

    return {
      ...menu,
      sections: menu.sections.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          if (typeof item.price !== "number") return item
          const converted = convertPrice(
            item.price,
            baseCurrency,
            targetCurrency,
            exchangeRates
          )
          return { ...item, price: converted }
        }),
      })),
    }
  }, [menu, exchangeRates, restaurant])

  if (!store.state) {
    return <div className="p-6 text-muted-foreground text-sm">Loading menu…</div>
  }

  if (!restaurant) {
    return (
      <div className="p-6">
        <div className="text-lg font-semibold">Restaurant not found</div>
        <div className="text-muted-foreground text-sm">No restaurant for slug: {restaurantSlug}</div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="p-6">
        <div className="text-lg font-semibold">{restaurant.name}</div>
        <div className="text-muted-foreground text-sm">No menu yet.</div>
      </div>
    )
  }

  // Apply per-restaurant tokens without touching global app tokens
  const tokenStyle = {
    ["--background" as never]: theme.tokens.background,
    ["--foreground" as never]: theme.tokens.foreground,
    ["--card" as never]: theme.tokens.card,
    ["--card-foreground" as never]: theme.tokens.cardForeground,
    ["--primary" as never]: theme.tokens.primary,
    ["--primary-foreground" as never]: theme.tokens.primaryForeground,
    ["--accent" as never]: theme.tokens.accent,
    ["--accent-foreground" as never]: theme.tokens.accentForeground,
    ["--muted" as never]: theme.tokens.muted,
    ["--muted-foreground" as never]: theme.tokens.mutedForeground,
    ["--border" as never]: theme.tokens.border,
    ["--ring" as never]: theme.tokens.ring,
    ["--radius" as never]: theme.tokens.radius,
  } as React.CSSProperties

  const Layout = theme.layout.layoutId === "modernCard" ? ModernCardMenu : MinimalMenu

  const currency = restaurant?.currency ?? "ALL"

  return (
    <div style={tokenStyle} className="bg-background text-foreground">
      <Layout
        restaurant={restaurant}
        menu={convertedMenu ?? menu}
        theme={theme}
        currency={currency}
        formatPrice={(price) => formatPrice(price, currency)}
      />
    </div>
  )
}


