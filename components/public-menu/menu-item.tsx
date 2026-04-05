"use client";

/* Next */
import Image from "next/image";

/* Utils */
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatting";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  image?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  onSelect?: () => void;
}

export default function MenuItem({ 
  name, 
  price, 
  description, 
  image = DEFAULT_IMAGES.MENU_ITEM,
  primaryColor,
  secondaryColor,
  accentColor,
  onSelect,
}: MenuItemProps) {
  return (
    <div 
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border/50 py-3 last:border-b-0",
        onSelect && "cursor-pointer"
      )}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
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
      <div 
        className="font-medium whitespace-nowrap"
        style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
      >
        {formatPrice(price)}
      </div>
    </div>
  );
}

