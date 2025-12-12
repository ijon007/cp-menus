import type { MenuThemeOverrides } from "@/lib/menu/types"

export type ThemePresetId = "coffeePastel" | "minimal" | "modernCard"

export type ResolvedMenuTheme = {
  id: ThemePresetId
  label: string
  tokens: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    primary: string
    primaryForeground: string
    accent: string
    accentForeground: string
    muted: string
    mutedForeground: string
    border: string
    ring: string
    radius: string
  }
  layout: {
    density: "comfortable" | "compact"
    layoutId: "minimal" | "modernCard"
    maxWidthClass: string
  }
  variants: {
    item: "row" | "card"
    section: "plain" | "card"
  }
}

export const THEME_PRESETS: Record<ThemePresetId, ResolvedMenuTheme> = {
  coffeePastel: {
    id: "coffeePastel",
    label: "Coffee pastel (default)",
    tokens: {
      background: "#F5EFE6",
      foreground: "#2B1E16",
      card: "#FFF8F0",
      cardForeground: "#2B1E16",
      primary: "#6F4E37",
      primaryForeground: "#FFF8F0",
      accent: "#A24B4B",
      accentForeground: "#FFF8F0",
      muted: "#EFE3D6",
      mutedForeground: "#5B4A3F",
      border: "#E6D5C3",
      ring: "#6F4E37",
      radius: "0.625rem",
    },
    layout: {
      density: "comfortable",
      layoutId: "minimal",
      maxWidthClass: "max-w-3xl",
    },
    variants: {
      item: "row",
      section: "plain",
    },
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    tokens: {
      background: "#FFFFFF",
      foreground: "#1F1F1F",
      card: "#FFFFFF",
      cardForeground: "#1F1F1F",
      primary: "#6F4E37",
      primaryForeground: "#FFF8F0",
      accent: "#A24B4B",
      accentForeground: "#FFF8F0",
      muted: "#F5F5F5",
      mutedForeground: "#666666",
      border: "#EAEAEA",
      ring: "#6F4E37",
      radius: "0.75rem",
    },
    layout: {
      density: "comfortable",
      layoutId: "minimal",
      maxWidthClass: "max-w-3xl",
    },
    variants: {
      item: "row",
      section: "plain",
    },
  },
  modernCard: {
    id: "modernCard",
    label: "Modern cards",
    tokens: {
      background: "#F5EFE6",
      foreground: "#2B1E16",
      card: "#FFF8F0",
      cardForeground: "#2B1E16",
      primary: "#6F4E37",
      primaryForeground: "#FFF8F0",
      accent: "#A24B4B",
      accentForeground: "#FFF8F0",
      muted: "#EFE3D6",
      mutedForeground: "#5B4A3F",
      border: "#E6D5C3",
      ring: "#6F4E37",
      radius: "0.9rem",
    },
    layout: {
      density: "comfortable",
      layoutId: "modernCard",
      maxWidthClass: "max-w-5xl",
    },
    variants: {
      item: "card",
      section: "card",
    },
  },
}

function deepMerge<T extends Record<string, unknown>>(base: T, patch?: Partial<T>): T {
  if (!patch) return base
  const out: Record<string, unknown> = { ...base }
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge((out[k] ?? {}) as Record<string, unknown>, v as Record<string, unknown>)
    } else if (v !== undefined) {
      out[k] = v
    }
  }
  return out as T
}

export function resolveTheme(presetId: ThemePresetId, overrides?: MenuThemeOverrides): ResolvedMenuTheme {
  const preset = THEME_PRESETS[presetId] ?? THEME_PRESETS.coffeePastel

  const patch: Record<string, unknown> = {}
  
  if (overrides?.tokens) {
    patch.tokens = Object.fromEntries(
      Object.entries(overrides.tokens).filter(([_, value]) => value !== undefined)
    )
  }
  
  if (overrides?.layout) {
    const layoutPatch: Record<string, unknown> = {}
    if (overrides.layout.density !== undefined) layoutPatch.density = overrides.layout.density
    if (overrides.layout.layoutId !== undefined) layoutPatch.layoutId = overrides.layout.layoutId
    if (Object.keys(layoutPatch).length > 0) {
      patch.layout = layoutPatch
    }
  }
  
  if (overrides?.variants) {
    const variantsPatch: Record<string, unknown> = {}
    if (overrides.variants.item !== undefined) variantsPatch.item = overrides.variants.item
    if (overrides.variants.section !== undefined) variantsPatch.section = overrides.variants.section
    if (Object.keys(variantsPatch).length > 0) {
      patch.variants = variantsPatch
    }
  }

  const merged = deepMerge(preset, patch)

  return {
    ...merged,
    // ensure required fields exist even if overrides were partial
    tokens: { ...preset.tokens, ...merged.tokens },
    layout: { ...preset.layout, ...merged.layout },
    variants: { ...preset.variants, ...merged.variants },
  }
}


