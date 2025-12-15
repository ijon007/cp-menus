"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CategorySelector from "@/components/public-menu/category-selector";
import MenuSection from "@/components/public-menu/menu-section";
import RestaurantHeader from "@/components/public-menu/restaurant-header";
import { formatSlugToTitle } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string | null;
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  const restaurantName = menuData.businessInfo?.businessName || formatSlugToTitle(restaurantSlug);

  const sections: Section[] = menuData.sections;
  const categories = sections.map((section) => section.name);

  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader
        businessName={restaurantName}
        logoUrl={menuData.businessInfo?.logoUrl}
        bannerUrl={menuData.businessInfo?.bannerUrl}
        googleReviewUrl={menuData.businessInfo?.googleReviewUrl}
        tripAdvisorReviewUrl={menuData.businessInfo?.tripAdvisorReviewUrl}
        socialLinks={menuData.businessInfo?.socialLinks}
      />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {categories.length > 0 && (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <div>
          {sections.length > 0 ? (
            sections.map((section) => (
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