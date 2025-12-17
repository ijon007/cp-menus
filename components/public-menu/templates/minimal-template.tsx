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

interface MinimalTemplateProps {
  sections: Section[];
  selectedCategory: string | null;
}

export default function MinimalTemplate({ sections, selectedCategory }: MinimalTemplateProps) {
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
          <div key={section.id} id={sectionId} className="mb-16 scroll-mt-20">
            {/* Minimal section header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-light text-foreground tracking-wider uppercase">
                {section.name}
              </h2>
              <div className="w-16 h-px bg-border mx-auto mt-4" />
            </div>
            
            {/* Minimal vertical list layout */}
            <div className="max-w-2xl mx-auto space-y-8">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* Image - minimal square */}
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative overflow-hidden rounded-sm bg-muted">
                    <Image
                      src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                      <h3 className="text-lg font-normal text-foreground tracking-wide">
                        {item.name}
                      </h3>
                      <div className="text-foreground font-light text-lg">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-xl">
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

