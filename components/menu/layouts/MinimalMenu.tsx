import type { Menu, Restaurant } from "@/lib/menu/types"
import type { ResolvedMenuTheme } from "@/lib/menu/themes"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function MinimalMenu({
  restaurant,
  menu,
  theme,
  currency = "ALL",
  formatPrice = (price: number) => `$${price.toFixed(0)}`,
}: {
  restaurant: Restaurant
  menu: Menu
  theme: ResolvedMenuTheme
  currency?: string
  formatPrice?: (price: number) => string
}) {
  const densityClass = theme.layout.density === "compact" ? "gap-2" : "gap-4"

  return (
    <div className="px-6 py-10">
      <div className={`mx-auto w-full ${theme.layout.maxWidthClass}`}>
        <div className="grid gap-2">
          <div className="text-3xl font-semibold tracking-tight">{restaurant.name}</div>
          <div className="text-muted-foreground">{menu.name}</div>
        </div>

        <Separator className="my-6" />

        <div className={`grid ${densityClass}`}>
          {menu.sections.map((section) => (
            <div key={section.id} className="grid gap-3">
              <div className="text-xl font-semibold">{section.title}</div>
              <div className={`grid ${densityClass}`}>
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="grid gap-1">
                      <div className="font-medium leading-none">{item.name}</div>
                      {item.description ? (
                        <div className="text-muted-foreground text-sm">{item.description}</div>
                      ) : null}
                      {item.tags?.length ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {item.tags.map((t) => (
                            <Badge key={t} variant="secondary">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {typeof item.price === "number" ? (
                      <div className="font-medium tabular-nums">{formatPrice(item.price)}</div>
                    ) : null}
                  </div>
                ))}
              </div>
              <Separator className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


