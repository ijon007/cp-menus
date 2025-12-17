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
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
}

export default function MinimalTemplate({
  sections,
  selectedCategory,
  primaryColor,
  secondaryColor,
  accentColor,
}: MinimalTemplateProps) {
  return (
    <>
      {sections.map((section) => {
        if (section.items.length === 0) return null;

        const sectionId = titleToSlug(section.name);

        const titleColor = primaryColor || undefined;
        const dividerColor = secondaryColor || primaryColor || undefined;
        const priceColor = accentColor || secondaryColor || undefined;
        
        return (
          <div key={section.id} id={sectionId} className="mb-16 scroll-mt-20">
            <div className="mb-8 text-center">
              <h2
                className="text-2xl font-light text-foreground tracking-wider uppercase"
                style={titleColor ? { color: titleColor } : undefined}
              >
                {section.name}
              </h2>
              <div
                className="w-16 h-px mx-auto mt-1 bg-primary"
                style={dividerColor ? { backgroundColor: dividerColor } : undefined}
              />
            </div>
            
            <div className="max-w-2xl mx-auto space-y-8">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  <div 
                    className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative overflow-hidden rounded-sm bg-muted border"
                    style={secondaryColor ? { borderColor: `${secondaryColor}30` } : undefined}
                  >
                    <Image
                      src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                      <h3 
                        className="text-lg font-normal tracking-wide"
                        style={primaryColor ? { color: primaryColor } : undefined}
                      >
                        {item.name}
                      </h3>
                      <div 
                        className="font-light text-lg"
                        style={priceColor ? { color: priceColor } : undefined}
                      >
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

