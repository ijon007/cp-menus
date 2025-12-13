"use client";

import Image from "next/image";

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
}

export default function MenuItem({ name, price, description, image = "/coffee-cup.webp" }: MenuItemProps) {
  // Format price to Albanian Lek
  const formatPrice = (price: string) => {
    const numPrice = price.replace(/[^0-9.]/g, "");
    if (!numPrice) return "0 Lek";
    return `${numPrice} Lek`;
  };

  return (
    <div className="flex items-start justify-between py-3 border-b border-border/50 last:border-0 gap-4">
      <div>
        <Image
          src={image}
          alt={name}
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-foreground font-semibold mb-1">{name}</h4>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="text-muted-foreground font-medium whitespace-nowrap">
        {formatPrice(price)}
      </div>
    </div>
  );
}

