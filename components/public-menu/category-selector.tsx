"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { getSectionIcon } from "@/lib/sections";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Convert category name to a valid ID slug
const titleToId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
    
    // Scroll to the section
    const sectionId = titleToId(category);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Update active category when selectedCategory changes externally
  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = getSectionIcon(category);
        return (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className={`whitespace-nowrap text-sm ${
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HugeiconsIcon icon={Icon} strokeWidth={2} className="w-4 h-4 mr-2" />
            {category}
          </Button>
        );
      })}
    </div>
  );
}

