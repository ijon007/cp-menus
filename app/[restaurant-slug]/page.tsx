"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CategorySelector from "@/components/public-menu/category-selector";
import MenuSection from "@/components/public-menu/menu-section";

interface Item {
  id: string;
  name: string;
  price: string;
  description?: string;
}

interface Section {
  id: string;
  name: string;
  items: Item[];
}

function MenuPage() {
  const params = useParams();
  const restaurantSlug = params["restaurant-slug"] as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const menuData = useQuery(api.publicMenu.getByBusinessSlug, { slug: restaurantSlug });

  if (menuData === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!menuData.businessInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Restaurant Not Found
            </h1>
            <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const sections: Section[] = menuData.sections;
  const categories = sections.map((section) => section.name);
  const filteredSections = selectedCategory
    ? sections.filter((section) => section.name === selectedCategory)
    : sections;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {menuData.businessInfo.businessName}
          </h1>
          <p className="text-muted-foreground">Welcome to our menu</p>
        </div>

        {categories.length > 0 && (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <div>
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <MenuSection key={section.id} title={section.name} items={section.items} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No menu items available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;