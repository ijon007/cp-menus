"use client";

/* Next */
import Image from "next/image";

/* Components */
import MenuItem from "../menu-item";
import MenuItemGrid from "../menu-item-grid";
import { useMenuItemPreview } from "../menu-item-preview";
import { useLanguage } from "@/app/menu/useLanguage";
import { getTranslated } from "@/app/menu/i18n";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/* Utils */
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatting";
import { titleToSlug } from "@/utils/slug";

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

interface ClassicTemplateProps {
  sections: Section[];
  selectedCategory: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
}

export default function ClassicTemplate({
  sections,
  selectedCategory,
  primaryColor,
  secondaryColor,
  accentColor,
}: ClassicTemplateProps) {
  const { language } = useLanguage();
  const { openPreview, previewProps } = useMenuItemPreview();

  return (
    <>
      {sections.map((section, index) => {
        if (section.items.length === 0) return null;

        const sectionId = titleToSlug(section.name);
        const sectionName = getTranslated(section.nameTranslations, language, section.name);

        if (index === 0) {
          const ItemCard = ({ item }: { item: Item }) => {
            const itemName = getTranslated(item.nameTranslations, language, item.name);
            const itemDesc = getTranslated(item.descriptionTranslations, language, item.description ?? "");
            return (
            <div 
              className={cn(
                "flex cursor-pointer flex-col gap-2 overflow-hidden rounded-sm"
              )}
              {...previewProps({
                name: itemName,
                price: item.price,
                description: itemDesc || undefined,
                image: item.image || DEFAULT_IMAGES.MENU_ITEM,
              })}
              style={secondaryColor ? { backgroundColor: `${secondaryColor}50` } : undefined}
            >
              <div 
                className={`relative w-full aspect-square overflow-hidden ${secondaryColor ? 'border-2' : ''}`}
                style={secondaryColor ? { borderColor: `${secondaryColor}10`} : undefined}
              >
                <Image
                  src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                  alt={itemName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 
                  className="font-semibold"
                  style={primaryColor ? { color: primaryColor } : undefined}
                >
                  {itemName}
                </h4>
                {itemDesc && (
                  <p className="text-muted-foreground text-sm line-clamp-2">{itemDesc}</p>
                )}
                <div 
                  className="font-medium mt-1"
                  style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
                >
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          );
          };

          const sectionTitleColor = primaryColor || undefined;
          
          return (
            <div key={section.id} id={sectionId} className="mb-8 scroll-mt-20">
              <div className="md:hidden">
                <h2
                  className="text-2xl font-bold text-foreground mb-4"
                  style={sectionTitleColor ? { color: sectionTitleColor } : undefined}
                >
                  {sectionName}
                </h2>
                <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                  <div className="flex gap-4 pb-4">
                    {section.items.map((item) => (
                      <div key={item.id} className="shrink-0 w-64">
                        <ItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-2xl font-semibold text-foreground"
                      style={sectionTitleColor ? { color: sectionTitleColor } : undefined}
                    >
                      {sectionName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <CarouselPrevious 
                        className="relative top-0 left-0 right-0 translate-x-0 translate-y-0"
                        style={primaryColor ? { 
                          borderColor: primaryColor,
                          color: primaryColor 
                        } : undefined}
                      />
                      <CarouselNext 
                        className="relative top-0 left-0 right-0 translate-x-0 translate-y-0"
                        style={primaryColor ? { 
                          borderColor: primaryColor,
                          color: primaryColor 
                        } : undefined}
                      />
                    </div>
                  </div>
                  <CarouselContent className="-ml-4">
                    {section.items.map((item) => (
                      <CarouselItem key={item.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                        <ItemCard item={item} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          );
        }

        if (index === 1) {
          const [firstItem, ...restItems] = section.items;
          const sectionTitleColor = primaryColor || undefined;
          return (
            <div key={section.id} id={sectionId} className="mb-8 scroll-mt-20">
              <h2
                className="text-2xl font-semibold text-foreground mb-4"
                style={sectionTitleColor ? { color: sectionTitleColor } : undefined}
              >
                {sectionName}
              </h2>
              <div className="space-y-4">
                {firstItem && (
                  <div className="w-full">
                    <div 
                      className="flex cursor-pointer flex-col gap-2 overflow-hidden rounded-sm"
                      {...previewProps({
                        name: getTranslated(firstItem.nameTranslations, language, firstItem.name),
                        price: firstItem.price,
                        description:
                          getTranslated(
                            firstItem.descriptionTranslations,
                            language,
                            firstItem.description ?? ""
                          ) || undefined,
                        image: firstItem.image || DEFAULT_IMAGES.MENU_ITEM,
                      })}
                      style={secondaryColor ? { backgroundColor: `${secondaryColor}50` } : undefined}
                    >
                      <div 
                        className={`relative w-full aspect-video overflow-hidden ${secondaryColor ? 'border-2' : ''}`}
                        style={secondaryColor ? { borderColor: `${secondaryColor}10` } : undefined}
                      >
                        <Image
                          src={firstItem.image || DEFAULT_IMAGES.MENU_ITEM}
                          alt={getTranslated(firstItem.nameTranslations, language, firstItem.name)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 
                          className="font-semibold"
                          style={primaryColor ? { color: primaryColor } : undefined}
                        >
                          {getTranslated(firstItem.nameTranslations, language, firstItem.name)}
                        </h4>
                        {getTranslated(firstItem.descriptionTranslations, language, firstItem.description ?? "") && (
                          <p className="text-muted-foreground text-sm line-clamp-2">{getTranslated(firstItem.descriptionTranslations, language, firstItem.description ?? "")}</p>
                        )}
                        <div 
                          className="font-medium mt-1"
                          style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
                        >
                          {formatPrice(firstItem.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {restItems.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {restItems.map((item) => (
                      <MenuItemGrid
                        key={item.id}
                        name={getTranslated(item.nameTranslations, language, item.name)}
                        price={item.price}
                        description={getTranslated(item.descriptionTranslations, language, item.description ?? "") || undefined}
                        image={item.image || DEFAULT_IMAGES.MENU_ITEM}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                        onSelect={() =>
                          openPreview({
                            name: getTranslated(item.nameTranslations, language, item.name),
                            price: item.price,
                            description:
                              getTranslated(
                                item.descriptionTranslations,
                                language,
                                item.description ?? ""
                              ) || undefined,
                            image: item.image || DEFAULT_IMAGES.MENU_ITEM,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }

        const sectionTitleColor = primaryColor || undefined;
        return (
          <div key={section.id} id={sectionId} className="mb-8 scroll-mt-20">
            <h2
              className="text-2xl font-semibold text-foreground mb-4"
              style={sectionTitleColor ? { color: sectionTitleColor } : undefined}
            >
              {sectionName}
            </h2>
            <div className="space-y-0">
              {section.items.map((item) => (
                <MenuItem
                  key={item.id}
                  name={getTranslated(item.nameTranslations, language, item.name)}
                  price={item.price}
                  description={getTranslated(item.descriptionTranslations, language, item.description ?? "") || undefined}
                  image={item.image || DEFAULT_IMAGES.MENU_ITEM}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  accentColor={accentColor}
                  onSelect={() =>
                    openPreview({
                      name: getTranslated(item.nameTranslations, language, item.name),
                      price: item.price,
                      description:
                        getTranslated(
                          item.descriptionTranslations,
                          language,
                          item.description ?? ""
                        ) || undefined,
                      image: item.image || DEFAULT_IMAGES.MENU_ITEM,
                    })
                  }
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

