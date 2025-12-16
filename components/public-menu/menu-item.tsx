"use client";

import Image from "next/image";
import { formatPrice } from "@/utils/formatting";
import { DEFAULT_IMAGES } from "@/constants/images";

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
}

export default function MenuItem({ name, price, description, image = DEFAULT_IMAGES.MENU_ITEM }: MenuItemProps) {

  return (
    <div className="flex items-start justify-between py-3 gap-4">
      <div className="w-16 h-16 shrink-0 relative overflow-hidden rounded-sm">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
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

