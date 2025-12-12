"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, ArrowLeftIcon, LogOutIcon } from "lucide-react"

import { MenuRenderer } from "@/components/menu/MenuRenderer"
import type { ThemePresetId } from "@/lib/menu/themes"
import { THEME_PRESETS } from "@/lib/menu/themes"
import type { MenuId, MenuSectionId, MenuItemId } from "@/lib/menu/types"
import { createId } from "@/lib/menu/utils"
import { useMenuStore } from "@/lib/menu/useMenuStore"
import { getCurrentRestaurantId, clearCurrentRestaurantId, isAuthenticated, clearAuthToken } from "@/lib/menu/store"

export default function MenuEditPage() {
  const router = useRouter()
  const params = useParams<{ "menu-id": string }>()
  const store = useMenuStore()
  const menuId = params["menu-id"] as MenuId

  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false)
  const [addItemDialogOpen, setAddItemDialogOpen] = useState<number | null>(null)
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")

  const currentRestaurantId = useMemo(() => {
    if (typeof window === "undefined") return null
    return getCurrentRestaurantId()
  }, [])

  const restaurant = useMemo(() => {
    if (!store.state || !currentRestaurantId) return null
    return store.state.restaurants.find((r) => r.id === currentRestaurantId) ?? null
  }, [store.state, currentRestaurantId])

  const menu = useMemo(() => {
    if (!store.state) return null
    return store.state.menus.find((m) => m.id === menuId) ?? null
  }, [store.state, menuId])

  const themePresetOptions = useMemo(
    () =>
      Object.values(THEME_PRESETS).map((p) => ({
        id: p.id,
        label: p.label,
      })),
    []
  )

  // Check authentication
  useEffect(() => {
    if (typeof window === "undefined") return
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push("/login")
      } else {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!currentRestaurantId && store.state) {
      router.push("/login")
    }
  }, [currentRestaurantId, store.state, router])

  useEffect(() => {
    if (!isCheckingAuth && (!menu || !restaurant || menu.restaurantId !== restaurant.id)) {
      router.push("/menus")
    }
  }, [isCheckingAuth, menu, restaurant, router])

  const handleLogout = () => {
    clearCurrentRestaurantId()
    clearAuthToken()
    router.push("/login")
  }

  const onAddSection = () => {
    if (!menu || !newSectionTitle.trim()) return
    store.updateMenu(menu.id, {
      sections: [
        ...menu.sections,
        {
          id: createId("sec"),
          title: newSectionTitle.trim(),
          items: [],
        },
      ],
    })
    setNewSectionTitle("")
    setAddSectionDialogOpen(false)
  }

  const onAddItemToSection = (sectionIndex: number) => {
    if (!menu) return
    const section = menu.sections[sectionIndex]
    if (!section || !newItemName.trim()) return
    store.updateMenu(menu.id, {
      sections: menu.sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: createId("item"),
                  name: newItemName.trim(),
                  description: newItemDescription.trim(),
                  price: Number(newItemPrice || 0),
                  tags: [],
                },
              ],
            }
          : s
      ),
    })
    setNewItemName("")
    setNewItemDescription("")
    setNewItemPrice("")
    setAddItemDialogOpen(null)
  }

  const onDeleteItem = (sectionIndex: number, itemIndex: number) => {
    if (!menu) return
    const section = menu.sections[sectionIndex]
    if (!section) return
    store.updateMenu(menu.id, {
      sections: menu.sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              items: s.items.filter((_, idx) => idx !== itemIndex),
            }
          : s
      ),
    })
  }

  const onDeleteSection = (sectionIndex: number) => {
    if (!menu) return
    store.updateMenu(menu.id, {
      sections: menu.sections.filter((_, i) => i !== sectionIndex),
    })
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Checking authentication...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!restaurant || !menu) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Menu not found</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/menus">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
            <div className="grid gap-1">
              <div className="text-lg font-semibold leading-none">{menu.name}</div>
              <div className="text-muted-foreground text-sm">Edit menu</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>Manage sections and items.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="menu">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
              </TabsList>

              <TabsContent value="menu" className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <Label>Menu name</Label>
                  <Input
                    value={menu.name}
                    onChange={(e) => store.updateMenu(menu.id, { name: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Sections ({menu.sections.length})
                  </div>
                  <Dialog open={addSectionDialogOpen} onOpenChange={setAddSectionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <PlusIcon className="size-4" />
                        Add Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Section</DialogTitle>
                        <DialogDescription>Create a new section for your menu.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Section title</Label>
                          <Input
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="e.g., Appetizers, Main Courses"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                onAddSection()
                              }
                            }}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddSectionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={onAddSection} disabled={!newSectionTitle.trim()}>
                          Add Section
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {menu.sections.map((section, sectionIndex) => (
                    <Card key={section.id} className="shadow-none border">
                      <CardContent className="p-4 grid gap-3">
                        <div className="grid gap-2">
                          <Label>Section title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) =>
                              store.updateSection(menu.id, section.id, {
                                title: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium flex items-center gap-2">
                            Items <Badge variant="secondary">{section.items.length}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog
                              open={addItemDialogOpen === sectionIndex}
                              onOpenChange={(open) => setAddItemDialogOpen(open ? sectionIndex : null)}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <PlusIcon className="size-4" />
                                  Add Item
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Item</DialogTitle>
                                  <DialogDescription>
                                    Add a new item to "{section.title}".
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label>Item name</Label>
                                    <Input
                                      value={newItemName}
                                      onChange={(e) => setNewItemName(e.target.value)}
                                      placeholder="e.g., Caesar Salad"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Price</Label>
                                    <Input
                                      type="number"
                                      inputMode="decimal"
                                      value={newItemPrice}
                                      onChange={(e) => setNewItemPrice(e.target.value)}
                                      placeholder="0"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      value={newItemDescription}
                                      onChange={(e) => setNewItemDescription(e.target.value)}
                                      placeholder="Optional description"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setAddItemDialogOpen(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => onAddItemToSection(sectionIndex)}
                                    disabled={!newItemName.trim()}
                                  >
                                    Add Item
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteSection(sectionIndex)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {section.items.map((item, itemIndex) => (
                            <div key={item.id} className="grid gap-2 rounded-md border p-3">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-2">
                                  <Label>Item name</Label>
                                  <Input
                                    value={item.name}
                                    onChange={(e) =>
                                      store.updateItem(menu.id, section.id, item.id, {
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Price</Label>
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    value={String(item.price ?? "")}
                                    onChange={(e) =>
                                      store.updateItem(menu.id, section.id, item.id, {
                                        price: Number(e.target.value || 0),
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={item.description ?? ""}
                                  onChange={(e) =>
                                    store.updateItem(menu.id, section.id, item.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  rows={2}
                                />
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDeleteItem(sectionIndex, itemIndex)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                          {section.items.length === 0 && (
                            <div className="text-muted-foreground text-sm text-center py-4">
                              No items yet. Add one.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {menu.sections.length === 0 && (
                    <div className="text-muted-foreground text-sm text-center py-4">
                      No sections yet. Add one.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="theme" className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <Label>Restaurant name</Label>
                  <Input
                    value={restaurant.name}
                    onChange={(e) =>
                      store.updateRestaurant(restaurant.id, { name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <Input
                    value={restaurant.slug}
                    onChange={(e) =>
                      store.updateRestaurant(restaurant.id, { slug: e.target.value })
                    }
                  />
                  <div className="text-muted-foreground text-xs">
                    Public URL: /{restaurant.slug}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label>Theme preset</Label>
                  <Select
                    value={restaurant.themePresetId}
                    onValueChange={(v) =>
                      store.updateRestaurant(restaurant.id, {
                        themePresetId: v as ThemePresetId,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themePresetOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Accent color override (hex)</Label>
                  <Input
                    placeholder="#A24B4B"
                    value={restaurant.themeOverrides.tokens?.accent ?? ""}
                    onChange={(e) =>
                      store.updateRestaurant(restaurant.id, {
                        themeOverrides: {
                          ...restaurant.themeOverrides,
                          tokens: {
                            ...restaurant.themeOverrides.tokens,
                            accent: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <div className="text-muted-foreground text-xs">
                    Override the accent color. Leave empty to use preset default.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              What customers see at{" "}
              <Link
                href={`/${restaurant.slug}`}
                className="text-primary underline underline-offset-4"
                target="_blank"
              >
                /{restaurant.slug}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <MenuRenderer restaurantSlug={restaurant.slug} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

