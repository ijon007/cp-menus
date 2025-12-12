import { z } from "zod"

export type RestaurantId = string
export type MenuId = string
export type MenuSectionId = string
export type MenuItemId = string

export const themeTokenSchema = z.object({
  background: z.string().optional(),
  foreground: z.string().optional(),
  card: z.string().optional(),
  cardForeground: z.string().optional(),
  primary: z.string().optional(),
  primaryForeground: z.string().optional(),
  accent: z.string().optional(),
  accentForeground: z.string().optional(),
  muted: z.string().optional(),
  mutedForeground: z.string().optional(),
  border: z.string().optional(),
  ring: z.string().optional(),
  radius: z.string().optional(),
})

export const menuThemeOverridesSchema = z.object({
  tokens: themeTokenSchema.optional(),
  layout: z
    .object({
      density: z.enum(["comfortable", "compact"]).optional(),
      layoutId: z.enum(["minimal", "modernCard"]).optional(),
    })
    .optional(),
  variants: z
    .object({
      item: z.enum(["row", "card"]).optional(),
      section: z.enum(["plain", "card"]).optional(),
    })
    .optional(),
})

export type MenuThemeOverrides = z.infer<typeof menuThemeOverridesSchema>

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
})

export type MenuItem = z.infer<typeof menuItemSchema>

export const menuSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(menuItemSchema),
})

export type MenuSection = z.infer<typeof menuSectionSchema>

export const menuSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  name: z.string(),
  sections: z.array(menuSectionSchema),
})

export type Menu = z.infer<typeof menuSchema>

export type Currency = "ALL" | "EUR" | "USD" | "GBP"

export const restaurantSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  themePresetId: z.string(),
  themeOverrides: menuThemeOverridesSchema.default({}),
  menuIds: z.array(z.string()),
  currency: z.enum(["ALL", "EUR", "USD", "GBP"]).default("USD"),
})

export type Restaurant = z.infer<typeof restaurantSchema>

export const menuStateSchema = z.object({
  version: z.literal(1),
  restaurants: z.array(restaurantSchema),
  menus: z.array(menuSchema),
})

export type MenuState = z.infer<typeof menuStateSchema>


