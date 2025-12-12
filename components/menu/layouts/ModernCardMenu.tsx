import type { Menu, Restaurant } from "@/lib/menu/types"
import type { ResolvedMenuTheme } from "@/lib/menu/themes"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ModernCardMenu({
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
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl tracking-tight">{restaurant.name}</CardTitle>
            <div className="text-muted-foreground">{menu.name}</div>
          </CardHeader>
          <CardContent className="grid gap-6">
            {menu.sections.map((section) => (
              <div key={section.id} className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xl font-semibold">{section.title}</div>
                </div>
                <div className={`grid ${densityClass} md:grid-cols-2`}>
                  {section.items.map((item) => (
                    <Card key={item.id} className="shadow-none">
                      <CardContent className="p-5 grid gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="grid gap-1">
                            <div className="font-semibold leading-none">{item.name}</div>
                            {item.description ? (
                              <div className="text-muted-foreground text-sm">{item.description}</div>
                            ) : null}
                          </div>
                          {typeof item.price === "number" ? (
                            <div className="font-semibold tabular-nums">{formatPrice(item.price)}</div>
                          ) : null}
                        </div>
                        {item.tags?.length ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.tags.map((t) => (
                              <Badge key={t} variant="secondary">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


