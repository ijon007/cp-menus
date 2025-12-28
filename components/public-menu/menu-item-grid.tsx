"use client";

/* Next */
import Image from "next/image";

/* Components */
import { Button } from "@/components/ui/button";

/* Utils */
import { formatPrice } from "@/utils/formatting";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

interface MenuItemGridProps {
  itemId: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  onAddToCart?: () => void;
}

export default function MenuItemGrid({
  itemId,
  name,
  price,
  description,
  image = DEFAULT_IMAGES.MENU_ITEM,
  primaryColor,
  secondaryColor,
  accentColor,
  onAddToCart,
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
        <div className="flex items-center justify-between mt-1">
          <div 
            className="font-medium"
            style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
          >
            {formatPrice(price)}
          </div>
          {onAddToCart && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onAddToCart}
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
}

