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

interface MenuItemProps {
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

export default function MenuItem({ 
  itemId,
  name, 
  price, 
  description, 
  image = DEFAULT_IMAGES.MENU_ITEM,
  primaryColor,
  secondaryColor,
  accentColor,
  onAddToCart,
}: MenuItemProps) {

  return (
    <div 
      className="flex items-start justify-between py-3 gap-4 border-b border-border/50 last:border-b-0"
      style={secondaryColor ? { 
        borderColor: `${secondaryColor}20`
      } : undefined}
    >
      <div 
        className={`w-16 h-16 shrink-0 relative overflow-hidden rounded-sm ${secondaryColor ? 'border' : ''}`}
        style={secondaryColor ? { borderColor: `${secondaryColor}40` } : undefined}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <h4 
          className="font-semibold mb-1"
          style={primaryColor ? { color: primaryColor } : undefined}
        >
          {name}
        </h4>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div 
          className="font-medium whitespace-nowrap"
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
  );
}

