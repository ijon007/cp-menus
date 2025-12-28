"use client";

/* Next */
import Image from "next/image";

/* Components */
import MenuItem from "./menu-item";
import MenuItemGrid from "./menu-item-grid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

interface MenuSectionProps {
  title: string;
  items: Item[];
  sectionIndex: number;
}

// Convert section name to a valid ID slug
const titleToId = (title: string): string => {
  return titleToSlug(title);
};

export default function MenuSection({ title, items, sectionIndex }: MenuSectionProps) {
  if (items.length === 0) return null;

  const sectionId = titleToId(title);

  // First section: horizontal scrollable list (mobile) / carousel (desktop)
  if (sectionIndex === 0) {
    const ItemCard = ({ item }: { item: Item }) => (
      <div className="flex flex-col gap-2">
        <div className="relative w-full aspect-square overflow-hidden rounded-sm">
          <Image
            src={item.image || DEFAULT_IMAGES.MENU_ITEM}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-foreground font-semibold">{item.name}</h4>
          {item.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
          )}
          <div className="text-muted-foreground font-medium mt-1">
            {formatPrice(item.price)}
          </div>
        </div>
      </div>
    );

    return (
      <div id={sectionId} className="mb-8 scroll-mt-20">
        {/* Mobile: touch scrollable, no scrollbar */}
        <div className="md:hidden">
          <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {items.map((item) => (
                <div key={item.id} className="shrink-0 w-64">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: carousel with navigation buttons next to title */}
        <div className="hidden md:block">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              <div className="flex items-center gap-2">
                <CarouselPrevious className="relative top-0 left-0 right-0 translate-x-0 translate-y-0" />
                <CarouselNext className="relative top-0 left-0 right-0 translate-x-0 translate-y-0" />
              </div>
            </div>
            <CarouselContent className="-ml-4">
              {items.map((item) => (
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

  // Second section: grid with first item full-width, rest in grid
  if (sectionIndex === 1) {
    const [firstItem, ...restItems] = items;
    return (
      <div id={sectionId} className="mb-8 scroll-mt-20">
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
        <div className="space-y-4">
          {/* First item full-width */}
          {firstItem && (
            <div className="w-full">
              <div className="flex flex-col gap-2">
                <div className="relative w-full aspect-video overflow-hidden rounded-sm">
                  <Image
                    src={firstItem.image || "/coffee-cup.webp"}
                    alt={firstItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-foreground font-semibold">{firstItem.name}</h4>
                  {firstItem.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">{firstItem.description}</p>
                  )}
                  <div className="text-muted-foreground font-medium mt-1">
                    {formatPrice(firstItem.price)}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Rest of items in grid */}
          {restItems.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {restItems.map((item) => (
                <MenuItemGrid
                  key={item.id}
                  itemId={String(item.id)}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image || "/coffee-cup.webp"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All other sections: regular list
  return (
    <div id={sectionId} className="mb-8 scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      <div className="space-y-0">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            itemId={String(item.id)}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image || "/coffee-cup.webp"}
          />
        ))}
      </div>
    </div>
  );
}

