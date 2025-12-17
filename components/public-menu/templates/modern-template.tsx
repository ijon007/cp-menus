"use client";

/* Next */
import Image from "next/image";

/* Utils */
import { formatPrice } from "@/utils/formatting";
import { titleToSlug } from "@/utils/slug";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

interface Item {
  id: string | number;
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

interface ModernTemplateProps {
  sections: Section[];
  selectedCategory: string | null;
}

export default function ModernTemplate({ sections, selectedCategory }: ModernTemplateProps) {
  // Filter sections by selected category if applicable
  const filteredSections = selectedCategory
    ? sections.filter((section) => section.name === selectedCategory)
    : sections;

  return (
    <>
      {filteredSections.map((section) => {
        if (section.items.length === 0) return null;

        const sectionId = titleToSlug(section.name);

        return (
          <div key={section.id} id={sectionId} className="mb-12 scroll-mt-20">
            <div className="mb-6 pb-3 border-b-2 border-primary/20">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">{section.name}</h2>
            </div>
            
            {/* Modern card-based grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Price badge overlay */}
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

