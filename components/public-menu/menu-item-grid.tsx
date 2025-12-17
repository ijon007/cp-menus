"use client";

/* Next */
import Image from "next/image";

/* Utils */
import { formatPrice } from "@/utils/formatting";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

interface MenuItemGridProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
}

export default function MenuItemGrid({
  name,
  price,
  description,
  image = DEFAULT_IMAGES.MENU_ITEM,
  primaryColor,
  secondaryColor,
  accentColor,
}: MenuItemGridProps) {

  return (
    <div 
      className="flex flex-col gap-2 overflow-hidden rounded-sm"
      style={secondaryColor ? { backgroundColor: `${secondaryColor}50` } : undefined}
    >
      <div 
        className={`relative w-full aspect-square overflow-hidden ${secondaryColor ? 'border-2' : ''}`}
        style={secondaryColor ? { borderColor: `${secondaryColor}10` } : undefined}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h4 
          className="font-semibold"
          style={primaryColor ? { color: primaryColor } : undefined}
        >
          {name}
        </h4>
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        )}
        <div 
          className="font-medium mt-1"
          style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
        >
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
}

