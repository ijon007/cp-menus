import { menuStateSchema, type MenuState } from "@/lib/menu/types"
import { seedMenuState } from "@/lib/menu/seed"

export const MENU_STORAGE_KEY = "cp-menus:v1"
export const CURRENT_RESTAURANT_ID_KEY = "cp-menus:current-restaurant-id"
export const AUTH_TOKEN_KEY = "cp-menus:auth-token"

export function getDefaultMenuState(): MenuState {
  return seedMenuState()
}

export function getCurrentRestaurantId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(CURRENT_RESTAURANT_ID_KEY)
}

export function setCurrentRestaurantId(restaurantId: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CURRENT_RESTAURANT_ID_KEY, restaurantId)
}

export function clearCurrentRestaurantId() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(CURRENT_RESTAURANT_ID_KEY)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export function readMenuState(): MenuState {
  if (typeof window === "undefined") return getDefaultMenuState()

  const raw = window.localStorage.getItem(MENU_STORAGE_KEY)
  if (!raw) return getDefaultMenuState()

  try {
    const parsed = JSON.parse(raw)
    const res = menuStateSchema.safeParse(parsed)
    if (!res.success) return getDefaultMenuState()
    return res.data
  } catch {
    return getDefaultMenuState()
  }
}

export function writeMenuState(state: MenuState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(state))
}

export function resetMenuState() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(MENU_STORAGE_KEY)
}


