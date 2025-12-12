"use client"

import * as React from "react"

import type {
  Menu,
  MenuId,
  MenuItemId,
  MenuSectionId,
  MenuState,
  Restaurant,
  RestaurantId,
} from "@/lib/menu/types"
import { readMenuState, writeMenuState } from "@/lib/menu/store"

type StoreApi = {
  state: MenuState | null
  setState: (next: MenuState) => void
  createRestaurant: (restaurant: Restaurant) => void
  updateRestaurant: (restaurantId: RestaurantId, patch: Partial<Restaurant>) => void
  createMenu: (menu: Menu) => void
  updateMenu: (menuId: MenuId, patch: Partial<Menu>) => void
  deleteMenu: (menuId: MenuId) => void
  updateSection: (
    menuId: MenuId,
    sectionId: MenuSectionId,
    patch: { title?: string }
  ) => void
  updateItem: (
    menuId: MenuId,
    sectionId: MenuSectionId,
    itemId: MenuItemId,
    patch: { name?: string; description?: string; price?: number }
  ) => void
}

function replaceRestaurant(
  restaurants: Restaurant[],
  restaurantId: RestaurantId,
  next: Restaurant
) {
  return restaurants.map((r) => (r.id === restaurantId ? next : r))
}

function replaceMenu(menus: Menu[], menuId: MenuId, next: Menu) {
  return menus.map((m) => (m.id === menuId ? next : m))
}

export function useMenuStore(): StoreApi {
  const [state, _setState] = React.useState<MenuState | null>(null)

  React.useEffect(() => {
    const initial = readMenuState()
    _setState(initial)

    const onStorage = (e: StorageEvent) => {
      if (e.key !== "cp-menus:v1") return
      _setState(readMenuState())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setState = React.useCallback((next: MenuState) => {
    _setState(next)
    writeMenuState(next)
  }, [])

  const createRestaurant = React.useCallback(
    (restaurant: Restaurant) => {
      if (!state) return
      setState({
        ...state,
        restaurants: [restaurant, ...state.restaurants],
      })
    },
    [state, setState]
  )

  const updateRestaurant = React.useCallback(
    (restaurantId: RestaurantId, patch: Partial<Restaurant>) => {
      if (!state) return
      const current = state.restaurants.find((r) => r.id === restaurantId)
      if (!current) return
      const next = { ...current, ...patch }
      setState({ ...state, restaurants: replaceRestaurant(state.restaurants, restaurantId, next) })
    },
    [state, setState]
  )

  const createMenu = React.useCallback(
    (menu: Menu) => {
      if (!state) return
      const restaurant = state.restaurants.find((r) => r.id === menu.restaurantId)
      if (!restaurant) return

      const nextRestaurant: Restaurant = {
        ...restaurant,
        menuIds: restaurant.menuIds.includes(menu.id)
          ? restaurant.menuIds
          : [...restaurant.menuIds, menu.id],
      }

      setState({
        ...state,
        restaurants: replaceRestaurant(state.restaurants, restaurant.id, nextRestaurant),
        menus: [menu, ...state.menus],
      })
    },
    [state, setState]
  )

  const updateMenu = React.useCallback(
    (menuId: MenuId, patch: Partial<Menu>) => {
      if (!state) return
      const current = state.menus.find((m) => m.id === menuId)
      if (!current) return
      const next = { ...current, ...patch }
      setState({ ...state, menus: replaceMenu(state.menus, menuId, next) })
    },
    [state, setState]
  )

  const deleteMenu = React.useCallback(
    (menuId: MenuId) => {
      if (!state) return
      const menu = state.menus.find((m) => m.id === menuId)
      if (!menu) return

      // Remove menu from restaurant's menuIds
      const restaurant = state.restaurants.find((r) => r.id === menu.restaurantId)
      if (restaurant) {
        const nextRestaurant: Restaurant = {
          ...restaurant,
          menuIds: restaurant.menuIds.filter((id) => id !== menuId),
        }
        setState({
          ...state,
          restaurants: replaceRestaurant(state.restaurants, restaurant.id, nextRestaurant),
          menus: state.menus.filter((m) => m.id !== menuId),
        })
      } else {
        setState({
          ...state,
          menus: state.menus.filter((m) => m.id !== menuId),
        })
      }
    },
    [state, setState]
  )

  const updateSection = React.useCallback(
    (menuId: MenuId, sectionId: MenuSectionId, patch: { title?: string }) => {
      if (!state) return
      const menu = state.menus.find((m) => m.id === menuId)
      if (!menu) return
      const nextMenu: Menu = {
        ...menu,
        sections: menu.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
      }
      setState({ ...state, menus: replaceMenu(state.menus, menuId, nextMenu) })
    },
    [state, setState]
  )

  const updateItem = React.useCallback(
    (
      menuId: MenuId,
      sectionId: MenuSectionId,
      itemId: MenuItemId,
      patch: { name?: string; description?: string; price?: number }
    ) => {
      if (!state) return
      const menu = state.menus.find((m) => m.id === menuId)
      if (!menu) return
      const nextMenu: Menu = {
        ...menu,
        sections: menu.sections.map((s) => {
          if (s.id !== sectionId) return s
          return {
            ...s,
            items: s.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
          }
        }),
      }
      setState({ ...state, menus: replaceMenu(state.menus, menuId, nextMenu) })
    },
    [state, setState]
  )

  return {
    state,
    setState,
    createRestaurant,
    updateRestaurant,
    createMenu,
    updateMenu,
    deleteMenu,
    updateSection,
    updateItem,
  }
}


