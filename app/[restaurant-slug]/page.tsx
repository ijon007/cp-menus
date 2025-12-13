"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import CategorySelector from "@/components/public-menu/category-selector";
import MenuSection from "@/components/public-menu/menu-section";

interface Item {
  id: number;
  name: string;
  price: string;
  description?: string;
}

interface Section {
  id: number;
  name: string;
  items: Item[];
}

function MenuPage() {
  const params = useParams();
  const restaurantSlug = params["restaurant-slug"] as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dummy data with 5 sections
  const sections: Section[] = [
    {
      id: 1,
      name: "Appetizers",
      items: [
        { id: 1, name: "Bruschetta", price: "450", description: "Toasted bread with fresh tomatoes and basil" },
        { id: 2, name: "Caesar Salad", price: "600", description: "Fresh romaine lettuce with Caesar dressing" },
        { id: 3, name: "Garlic Bread", price: "350", description: "Warm bread with garlic butter" },
        { id: 4, name: "Soup of the Day", price: "500", description: "Chef's daily special soup" },
      ],
    },
    {
      id: 2,
      name: "Main Courses",
      items: [
        { id: 5, name: "Grilled Chicken", price: "1200", description: "Tender grilled chicken breast with herbs" },
        { id: 6, name: "Beef Steak", price: "1800", description: "Premium beef steak cooked to perfection" },
        { id: 7, name: "Pasta Carbonara", price: "950", description: "Creamy pasta with bacon and parmesan" },
        { id: 8, name: "Salmon Fillet", price: "1500", description: "Fresh salmon with lemon and herbs" },
        { id: 9, name: "Vegetarian Risotto", price: "850", description: "Creamy risotto with seasonal vegetables" },
      ],
    },
    {
      id: 3,
      name: "Desserts",
      items: [
        { id: 10, name: "Chocolate Cake", price: "550", description: "Rich chocolate cake with ganache" },
        { id: 11, name: "Tiramisu", price: "600", description: "Classic Italian dessert with coffee" },
        { id: 12, name: "Ice Cream", price: "400", description: "Homemade ice cream, choice of flavors" },
        { id: 13, name: "Cheesecake", price: "650", description: "Creamy New York style cheesecake" },
      ],
    },
    {
      id: 4,
      name: "Beverages",
      items: [
        { id: 14, name: "Coffee", price: "200", description: "Freshly brewed coffee" },
        { id: 15, name: "Fresh Juice", price: "350", description: "Daily fresh fruit juice" },
        { id: 16, name: "Soft Drinks", price: "250", description: "Assorted soft drinks" },
        { id: 17, name: "Wine", price: "800", description: "Selection of fine wines" },
      ],
    },
    {
      id: 5,
      name: "Specials",
      items: [
        { id: 18, name: "Chef's Special", price: "2000", description: "Today's special creation by our chef" },
        { id: 19, name: "Daily Combo", price: "1500", description: "Main course with soup and dessert" },
        { id: 20, name: "Family Platter", price: "3500", description: "Large platter perfect for sharing" },
      ],
    },
  ];

  const categories = sections.map((section) => section.name);
  const filteredSections = selectedCategory
    ? sections.filter((section) => section.name === selectedCategory)
    : sections;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {restaurantSlug ? restaurantSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Restaurant Menu"}
          </h1>
          <p className="text-muted-foreground">Welcome to our menu</p>
        </div>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div>
          {filteredSections.map((section) => (
            <MenuSection key={section.id} title={section.name} items={section.items} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;