import {
  DrinkIcon,
  PlateIcon,
  Coffee01Icon,
  Hamburger01Icon,
  Menu01Icon,
  DishIcon,
  Dish01Icon,
  PizzaIcon,
  IceCreamIcon,
  FrenchFriesIcon,
  HotdogIcon,
  TacoIcon,
  Restaurant01Icon,
  Bread01Icon,
} from "@hugeicons/core-free-icons";

/**
 * Default icon for sections that don't match any predefined ones
 */
export const DEFAULT_SECTION_ICON = Menu01Icon;

/**
 * Mapping of section names (normalized) to their corresponding icons
 * The keys are normalized (lowercase, singular) for matching
 * Using available icons from Hugeicons - can be expanded as needed
 */
export const SECTION_ICONS: Record<string, any> = {
  // Drinks & Beverages
  drink: DrinkIcon,
  drinks: DrinkIcon,
  beverage: DrinkIcon,
  beverages: DrinkIcon,
  coffee: Coffee01Icon,
  teas: Coffee01Icon,
  tea: Coffee01Icon,
  juice: DrinkIcon,
  juices: DrinkIcon,
  smoothie: DrinkIcon,
  smoothies: DrinkIcon,
  cocktail: DrinkIcon,
  cocktails: DrinkIcon,
  beer: DrinkIcon,
  wines: DrinkIcon,
  wine: DrinkIcon,

  // Appetizers & Starters
  appetizer: PlateIcon,
  appetizers: PlateIcon,
  starter: PlateIcon,
  starters: PlateIcon,
  "appetizer & starters": PlateIcon,
  "appetizers & starters": PlateIcon,

  // Main Courses & Entrees
  "main course": PlateIcon,
  "main courses": PlateIcon,
  entree: PlateIcon,
  entrees: PlateIcon,
  "main dish": PlateIcon,
  "main dishes": PlateIcon,
  mains: PlateIcon,

  // Fast Food
  "fast food": Hamburger01Icon,
  fastfood: Hamburger01Icon,
  "quick bites": Hamburger01Icon,

  // Chicken (using Dish01Icon for variety)
  chicken: Dish01Icon,
  chickens: Dish01Icon,
  "chicken dishes": Dish01Icon,

  // Sandwiches (using Bread01Icon for variety)
  sandwich: Bread01Icon,
  sandwiches: Bread01Icon,
  sub: Bread01Icon,
  subs: Bread01Icon,
  wrap: Bread01Icon,
  wraps: Bread01Icon,

  // Salads (using DishIcon)
  salad: DishIcon,
  salads: DishIcon,

  // Desserts
  dessert: IceCreamIcon,
  desserts: IceCreamIcon,
  sweets: IceCreamIcon,
  "ice cream": IceCreamIcon,
  icecream: IceCreamIcon,
  "ice creams": IceCreamIcon,

  // Sides
  side: FrenchFriesIcon,
  sides: FrenchFriesIcon,
  "side dish": FrenchFriesIcon,
  "side dishes": FrenchFriesIcon,

  // Mexican Food
  taco: TacoIcon,
  tacos: TacoIcon,
  burrito: TacoIcon,
  burritos: TacoIcon,
  quesadilla: TacoIcon,
  quesadillas: TacoIcon,
  enchilada: TacoIcon,
  enchiladas: TacoIcon,
  chimichanga: TacoIcon,
  chimichangas: TacoIcon,

  // Pizza
  pizza: PizzaIcon,
  pizzas: PizzaIcon,

  // Burgers
  burger: Hamburger01Icon,
  burgers: Hamburger01Icon,
  hamburger: Hamburger01Icon,
  hamburgers: Hamburger01Icon,

  // Hot Dogs
  "hot dog": HotdogIcon,
  hotdog: HotdogIcon,
  "hot dogs": HotdogIcon,
  hotdogs: HotdogIcon,

  // Soups (using Dish01Icon for variety)
  soup: Dish01Icon,
  soups: Dish01Icon,
  stew: Dish01Icon,
  stews: Dish01Icon,

  // Breakfast
  breakfast: Bread01Icon,
  "breakfast items": Bread01Icon,
  brunch: Bread01Icon,

  // Seafood (using DishIcon)
  seafood: DishIcon,
  fish: DishIcon,
  "fish dishes": DishIcon,
  shrimp: DishIcon,
  shrimps: DishIcon,
  "seafood dishes": DishIcon,

  // Meat (using Dish01Icon)
  beef: Dish01Icon,
  "beef dishes": Dish01Icon,
  steak: Dish01Icon,
  steaks: Dish01Icon,
  pork: Dish01Icon,
  "pork dishes": Dish01Icon,

  // Vegetarian/Vegan (using PlateIcon)
  vegetarian: PlateIcon,
  vegan: PlateIcon,
  "vegetarian options": PlateIcon,
  "vegan options": PlateIcon,

  // Kids Menu
  "kids menu": Menu01Icon,
  "kids meals": Menu01Icon,
  "children's menu": Menu01Icon,

  // Specials
  special: Menu01Icon,
  specials: Menu01Icon,
  "daily specials": Menu01Icon,
  "chef's special": Menu01Icon,
  "chef specials": Menu01Icon,
};

/**
 * Normalizes a section name for icon matching
 * - Converts to lowercase
 * - Removes extra whitespace
 * - Handles common variations
 */
function normalizeSectionName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Gets the icon for a given section name
 * Returns the default icon if no match is found
 */
export function getSectionIcon(sectionName: string): any {
  const normalized = normalizeSectionName(sectionName);
  
  // Try exact match first
  if (SECTION_ICONS[normalized]) {
    return SECTION_ICONS[normalized];
  }
  
  // Try matching against keys (handles partial matches for compound names)
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  
  // Return default icon if no match found
  return DEFAULT_SECTION_ICON;
}

