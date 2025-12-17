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
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
}

export default function ModernTemplate({
  sections,
  selectedCategory,
  primaryColor,
  secondaryColor,
  accentColor,
}: ModernTemplateProps) {
  const filteredSections = selectedCategory
    ? sections.filter((section) => section.name === selectedCategory)
    : sections;

  return (
    <>
      {filteredSections.map((section) => {
        if (section.items.length === 0) return null;

        const sectionId = titleToSlug(section.name);

        const borderColor = primaryColor || undefined;
        const titleColor = primaryColor || undefined;
        const priceBadgeColor = primaryColor || undefined;
        const hoverColor = accentColor || primaryColor || undefined;
        
        return (
          <div key={section.id} id={sectionId} className="mb-12 scroll-mt-20">
            <div
              className="mb-6 pb-3 border-b-2"
              style={borderColor ? { borderColor: `${borderColor}33` } : undefined}
            >
              <h2
                className="text-3xl font-semibold text-foreground tracking-tight"
                style={titleColor ? { color: titleColor } : undefined}
              >
                {section.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  style={secondaryColor ? { 
                    borderColor: `${secondaryColor}40`,
                    '--hover-border': `${secondaryColor}60`
                  } as React.CSSProperties & { '--hover-border': string } : undefined}
                  onMouseEnter={(e) => {
                    if (secondaryColor) {
                      e.currentTarget.style.borderColor = `${secondaryColor}60`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (secondaryColor) {
                      e.currentTarget.style.borderColor = `${secondaryColor}40`;
                    }
                  }}
                >
                  <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
                    <Image
                      src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div 
                    className="p-5 flex flex-col gap-3 flex-1"
                    style={(secondaryColor || primaryColor) ? { 
                      backgroundColor: `${(secondaryColor || primaryColor)}50`,
                    } : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="text-lg font-semibold transition-colors flex-1"
                        style={primaryColor ? { color: primaryColor } : undefined}
                        onMouseEnter={(e) => {
                          if (hoverColor) {
                            e.currentTarget.style.color = hoverColor;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (hoverColor) {
                            e.currentTarget.style.color = primaryColor || '';
                          }
                        }}
                      >
                        {item.name}
                      </h3>
                      <div
                        className="font-semibold text-lg shrink-0"
                        style={(accentColor || primaryColor) ? { color: (accentColor || primaryColor) || undefined } : undefined}
                      >
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    {item.description && (
                      <p 
                        className="text-sm leading-relaxed line-clamp-2"
                        style={(secondaryColor || primaryColor) ? { color: `${(secondaryColor || primaryColor)}DD` } : undefined}
                      >
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

