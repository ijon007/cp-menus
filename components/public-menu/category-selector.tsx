"use client";

/* Next */
import { useEffect, useState } from "react";

/* Components */
import { Button } from "@/components/ui/button";

/* Utils */
import { getSectionIcon } from "@/lib/sections";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  template?: string | null;
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
  primaryColor,
  secondaryColor,
  accentColor,
  template,
}: CategorySelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);

  const handleCategoryClick = (category: string) => {
    // Toggle: if already selected, unselect it
    if (activeCategory === category) {
      setActiveCategory(null);
      onSelectCategory(null);
    } else {
      setActiveCategory(category);
      onSelectCategory(category);
    }
    
    // Always scroll to the section when clicking a category
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

  const activeBgColor = primaryColor || undefined;
  const activeTextColor = primaryColor ? "#ffffff" : undefined;
  const inactiveBorderColor = secondaryColor || primaryColor || undefined;
  const hoverColor = accentColor || primaryColor || undefined;
  const isModern = template === "modern";

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = getSectionIcon(category);
        const isActive = activeCategory === category;
        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className={`whitespace-nowrap text-sm transition-colors ${isModern ? "rounded-full px-4 py-4" : ""}`}
            style={
              isActive
                ? activeBgColor
                  ? {
                      backgroundColor: activeBgColor,
                      color: activeTextColor,
                      borderColor: activeBgColor,
                    }
                  : undefined
                : inactiveBorderColor
                  ? {
                      borderColor: `${inactiveBorderColor}40`,
                      color: undefined,
                    }
                  : undefined
            }
            onMouseEnter={(e) => {
              if (!isActive && hoverColor) {
                e.currentTarget.style.borderColor = hoverColor;
                e.currentTarget.style.color = hoverColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                if (inactiveBorderColor) {
                  e.currentTarget.style.borderColor = `${inactiveBorderColor}40`;
                }
                e.currentTarget.style.color = "";
              }
            }}
          >
            <HugeiconsIcon icon={Icon} strokeWidth={2} className="w-4 h-4 mr-2" />
            {category}
          </Button>
        );
      })}
    </div>
  );
}

