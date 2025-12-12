"use client"

import { useParams } from "next/navigation"

import { MenuRenderer } from "@/components/menu/MenuRenderer"

export default function RestaurantMenuPage() {
  const params = useParams<{ restaurant: string }>()

  return <MenuRenderer restaurantSlug={params.restaurant} />
}


