"use client";

/* Next */
import Image from "next/image";

/* Components */
import MenuItem from "../menu-item";
import MenuItemGrid from "../menu-item-grid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

/* Utils */
import { formatPrice } from "@/utils/formatting";
import { titleToSlug } from "@/utils/slug";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

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

interface ClassicTemplateProps {
  sections: Section[];
  selectedCategory: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  onAddToCart?: (itemId: string, name: string, price: string) => void;
}

export default function ClassicTemplate({
  sections,
  selectedCategory,
  primaryColor,
  secondaryColor,
  accentColor,
  onAddToCart,
}: ClassicTemplateProps) {
  return (
    <>
      {sections.map((section, index) => {
        if (section.items.length === 0) return null;

        const sectionId = titleToSlug(section.name);

        if (index === 0) {
          const ItemCard = ({ item }: { item: Item }) => (
            <div 
              className="flex flex-col gap-2 overflow-hidden rounded-sm"
              style={secondaryColor ? { backgroundColor: `${secondaryColor}50` } : undefined}
            >
              <div 
                className={`relative w-full aspect-square overflow-hidden ${secondaryColor ? 'border-2' : ''}`}
                style={secondaryColor ? { borderColor: `${secondaryColor}10`} : undefined}
              >
                <Image
                  src={item.image || DEFAULT_IMAGES.MENU_ITEM}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 
                  className="font-semibold"
                  style={primaryColor ? { color: primaryColor } : undefined}
                >
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <div 
                    className="font-medium"
                    style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
                  >
                    {formatPrice(item.price)}
                  </div>
                  {onAddToCart && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onAddToCart(String(item.id), item.name, item.price)}
                      style={primaryColor ? { 
                        borderColor: primaryColor,
                        color: primaryColor 
                      } : undefined}
                    >
                      <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );

          const sectionTitleColor = primaryColor || undefined;
          
          return (
            <div key={section.id} id={sectionId} className="mb-8 scroll-mt-20">
              <div className="md:hidden">
                <h2
                  className="text-2xl font-bold text-foreground mb-4"
                  style={sectionTitleColor ? { color: sectionTitleColor } : undefined}
                >
                  {section.name}
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
                      {section.name}
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
                {section.name}
              </h2>
              <div className="space-y-4">
                {firstItem && (
                  <div className="w-full">
                    <div 
                      className="flex flex-col gap-2 overflow-hidden rounded-sm"
                      style={secondaryColor ? { backgroundColor: `${secondaryColor}50` } : undefined}
                    >
                      <div 
                        className={`relative w-full aspect-video overflow-hidden ${secondaryColor ? 'border-2' : ''}`}
                        style={secondaryColor ? { borderColor: `${secondaryColor}10` } : undefined}
                      >
                        <Image
                          src={firstItem.image || DEFAULT_IMAGES.MENU_ITEM}
                          alt={firstItem.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 
                          className="font-semibold"
                          style={primaryColor ? { color: primaryColor } : undefined}
                        >
                          {firstItem.name}
                        </h4>
                        {firstItem.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">{firstItem.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <div 
                            className="font-medium"
                            style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
                          >
                            {formatPrice(firstItem.price)}
                          </div>
                          {onAddToCart && (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => onAddToCart(String(firstItem.id), firstItem.name, firstItem.price)}
                              style={primaryColor ? { 
                                borderColor: primaryColor,
                                color: primaryColor 
                              } : undefined}
                            >
                              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                            </Button>
                          )}
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
                        itemId={String(item.id)}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        image={item.image || DEFAULT_IMAGES.MENU_ITEM}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                        onAddToCart={onAddToCart ? () => onAddToCart(String(item.id), item.name, item.price) : undefined}
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
              {section.name}
            </h2>
            <div className="space-y-0">
              {section.items.map((item) => (
                <MenuItem
                  key={item.id}
                  itemId={String(item.id)}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image || DEFAULT_IMAGES.MENU_ITEM}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  accentColor={accentColor}
                  onAddToCart={onAddToCart ? () => onAddToCart(String(item.id), item.name, item.price) : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

