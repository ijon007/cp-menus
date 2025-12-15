"use client";

import Image from "next/image";

interface MenuItemGridProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
}

export default function MenuItemGrid({
  name,
  price,
  description,
  image = "/coffee-cup.webp",
}: MenuItemGridProps) {
  // Format price to Albanian Lek
  const formatPrice = (price: string) => {
    const numPrice = price.replace(/[^0-9.]/g, "");
    if (!numPrice) return "0 Lek";
    return `${numPrice} Lek`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full aspect-square overflow-hidden rounded-sm">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-foreground font-semibold">{name}</h4>
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        )}
        <div className="text-muted-foreground font-medium mt-1">
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
}

