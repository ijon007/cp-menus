import type { MenuState } from "@/lib/menu/types"

export function seedMenuState(): MenuState {
  return {
    version: 1,
    restaurants: [
      {
        id: "rest_cafe_luna",
        name: "Cafe Luna",
        slug: "cafe-luna",
        themePresetId: "coffeePastel",
        themeOverrides: {},
        menuIds: ["menu_cafe_luna_main"],
        currency: "USD",
      },
    ],
    menus: [
      {
        id: "menu_cafe_luna_main",
        restaurantId: "rest_cafe_luna",
        name: "Main Menu",
        sections: [
          {
            id: "sec_breakfast",
            title: "Breakfast",
            items: [
              {
                id: "item_pancakes",
                name: "Brown sugar pancakes",
                description: "Stack of pancakes with maple + cinnamon butter.",
                price: 11,
                tags: ["popular"],
              },
              {
                id: "item_avotoast",
                name: "Avocado toast",
                description: "Sourdough, avocado, chili flakes, lemon.",
                price: 9,
                tags: ["veg"],
              },
            ],
          },
          {
            id: "sec_drinks",
            title: "Coffee & Drinks",
            items: [
              {
                id: "item_lattee",
                name: "Latte",
                description: "Espresso + steamed milk.",
                price: 5,
                tags: ["coffee"],
              },
              {
                id: "item_coldbrew",
                name: "Cold brew",
                description: "Slow steeped, smooth finish.",
                price: 6,
                tags: ["coffee"],
              },
            ],
          },
        ],
      },
    ],
  }
}


