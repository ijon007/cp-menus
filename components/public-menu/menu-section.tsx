"use client";

import MenuItem from "./menu-item";
import MenuItemGrid from "./menu-item-grid";

interface Item {
  id: string | number;
  name: string;
  price: string;
  description?: string;
  image?: string | null;
}

interface MenuSectionProps {
  title: string;
  items: Item[];
}

const getLayoutType = (sectionName: string): "grid" | "list" => {
  const gridSections = ["burritos", "tacos", "quesadillas", "enchiladas", "chimichanga"];
  return gridSections.includes(sectionName.toLowerCase()) ? "grid" : "list";
};

// Convert section name to a valid ID slug
const titleToId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function MenuSection({ title, items }: MenuSectionProps) {
  if (items.length === 0) return null;

  const layoutType = getLayoutType(title);
  const sectionId = titleToId(title);

  return (
    <div id={sectionId} className="mb-8 scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      {layoutType === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <MenuItemGrid
              key={item.id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image || "/coffee-cup.webp"}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image || "/coffee-cup.webp"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

