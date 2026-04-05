"use client";

/* Next */
import Image from "next/image";

/* Components */
import { useMenuItemPreview } from "../menu-item-preview";

/* Utils */
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatting";
import { titleToSlug } from "@/utils/slug";
import { useLanguage } from "@/app/menu/useLanguage";
import { getTranslated } from "@/app/menu/i18n";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

interface Item {
  id: string | number;
  name: string;
  nameTranslations?: { en: string; sq: string; it: string };
  price: string;
  description?: string;
  descriptionTranslations?: { en: string; sq: string; it: string };
  image?: string | null;
}

interface Section {
  id: string;
  name: string;
  nameTranslations?: { en: string; sq: string; it: string };
  items: Item[];
}

interface MinimalTemplateProps {
  sections: Section[];
  selectedCategory: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
}

export default function MinimalTemplate({
  sections,
  selectedCategory,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
}: MinimalTemplateProps) {
  const { language } = useLanguage();
  const { previewProps } = useMenuItemPreview();

  return (
    <>
      {sections.map((section) => {
        if (section.items.length === 0) return null;

        const sectionId = titleToSlug(section.name);
        const sectionName = getTranslated(section.nameTranslations, language, section.name);

        const titleColor = primaryColor || undefined;
        const dividerColor = secondaryColor || primaryColor || undefined;
        const priceColor = accentColor || secondaryColor || undefined;
        
        return (
          <div 
            key={section.id} 
            id={sectionId} 
            className="mb-16 scroll-mt-20"
            {...(backgroundColor ? { style: { backgroundColor } } : {})}
          >
            <div className="mb-8 text-center">
              <h2
                className="text-2xl font-light text-foreground tracking-wider uppercase"
                style={titleColor ? { color: titleColor } : undefined}
              >
                {sectionName}
              </h2>
              <div
                className="w-16 h-px mx-auto mt-1 bg-primary"
                style={dividerColor ? { backgroundColor: dividerColor } : undefined}
              />
            </div>
            
            <div className="max-w-2xl mx-auto space-y-8">
              {section.items.map((item) => {
                const itemName = getTranslated(item.nameTranslations, language, item.name);
                const itemDesc = getTranslated(item.descriptionTranslations, language, item.description ?? "");
                return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-row items-center gap-6",
                    "cursor-pointer"
                  )}
                  {...previewProps({
                    name: itemName,
                    price: item.price,
                    description: itemDesc || undefined,
                    image: item.image || DEFAULT_IMAGES.MENU_ITEM,
                  })}
                >
                  <div 
                    className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative overflow-hidden rounded-sm bg-muted border"
                    style={secondaryColor ? { borderColor: `${secondaryColor}30` } : undefined}
                  >
                    <Image
                      src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                      alt={itemName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-row items-baseline justify-between gap-2">
                      <h3 
                        className="text-lg font-normal tracking-wide"
                        style={primaryColor ? { color: primaryColor } : undefined}
                      >
                        {itemName}
                      </h3>
                      <div 
                        className="font-light text-lg"
                        style={priceColor ? { color: priceColor } : undefined}
                      >
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    {itemDesc && (
                      <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-xl">
                        {itemDesc}
                      </p>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

