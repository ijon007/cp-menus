"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PlusIcon, LogOutIcon, TrashIcon, EditIcon } from "lucide-react"

import { useMenuStore } from "@/lib/menu/useMenuStore"
import { getCurrentRestaurantId, clearCurrentRestaurantId, isAuthenticated, clearAuthToken } from "@/lib/menu/store"
import { createId } from "@/lib/menu/utils"
import type { Currency } from "@/lib/menu/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MenusPage() {
  const router = useRouter()
  const store = useMenuStore()
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null)

  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const currentRestaurantId = useMemo(() => {
    if (typeof window === "undefined") return null
    return getCurrentRestaurantId()
  }, [])

  const restaurant = useMemo(() => {
    if (!store.state || !currentRestaurantId) return null
    return store.state.restaurants.find((r) => r.id === currentRestaurantId) ?? null
  }, [store.state, currentRestaurantId])

  const restaurantMenus = useMemo(() => {
    if (!store.state || !restaurant) return []
    return store.state.menus.filter((m) => restaurant.menuIds.includes(m.id))
  }, [store.state, restaurant])

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

  const handleLogout = () => {
    clearCurrentRestaurantId()
    clearAuthToken()
    router.push("/login")
  }

  const onCreateMenu = () => {
    if (!restaurant) return
    const menuId = createId("menu")
    store.createMenu({
      id: menuId,
      restaurantId: restaurant.id,
      name: "New Menu",
      sections: [],
    })
    router.push(`/menus/${menuId}`)
  }

  const onDeleteMenu = (menuId: string) => {
    store.deleteMenu(menuId)
    setDeleteMenuId(null)
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

  if (!restaurant) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading restaurant...</div>
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
          <div className="grid gap-1">
            <div className="text-lg font-semibold leading-none">{restaurant.name}</div>
            <div className="text-muted-foreground text-sm">Manage your menus</div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {restaurant.currency}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => store.updateRestaurant(restaurant.id, { currency: "ALL" })}
                >
                  Albanian Lek
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => store.updateRestaurant(restaurant.id, { currency: "EUR" })}
                >
                  Euro
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => store.updateRestaurant(restaurant.id, { currency: "USD" })}
                >
                  US Dollar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => store.updateRestaurant(restaurant.id, { currency: "GBP" })}
                >
                  British Pound
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-medium">Menus ({restaurantMenus.length})</div>
          <Button onClick={onCreateMenu}>
            <PlusIcon className="size-4" />
            New Menu
          </Button>
        </div>

        {restaurantMenus.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-8">
                No menus yet. Create your first menu.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurantMenus.map((menu) => {
              const totalItems = menu.sections.reduce((sum, sec) => sum + sec.items.length, 0)
              return (
                <Card key={menu.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{menu.name}</CardTitle>
                    <CardDescription>
                      {menu.sections.length} section{menu.sections.length !== 1 ? "s" : ""} •{" "}
                      {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2">
                    <Button asChild variant="default" className="flex-1">
                      <Link href={`/menus/${menu.id}`}>
                        <EditIcon className="size-4" />
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog open={deleteMenuId === menu.id} onOpenChange={(open) => setDeleteMenuId(open ? menu.id : null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <TrashIcon className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete menu?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{menu.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteMenu(menu.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

