"use client";

/* Next */
import { useRouter } from "next/navigation";

/* Components */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* Utils */
import { titleToSlug } from "@/lib/utils";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { SettingsIcon, LiveStreaming02Icon, ShoppingCart01Icon, Menu01Icon } from "@hugeicons/core-free-icons";

interface MenuHeaderActionsProps {
  businessName?: string | null;
}

export default function MenuHeaderActions({ businessName }: MenuHeaderActionsProps) {
  const router = useRouter();

  const handleViewLiveMenu = () => {
    if (businessName) {
      const slug = titleToSlug(businessName);
      router.push(`/${slug}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop buttons - hidden on mobile */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20"
          onClick={() => router.push("/orders")}
        >
          <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} />
          <span>View Orders</span>
        </Button>
        {businessName && (
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20"
            onClick={handleViewLiveMenu}
          >
            <HugeiconsIcon icon={LiveStreaming02Icon} strokeWidth={2} />
            <span>View Live</span>
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20"
          onClick={() => router.push("/settings")}
        >
          <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
        </Button>
      </div>

      {/* Mobile dropdown - hidden on desktop */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20 self-center"
            />
          }
        >
          <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover">
          <DropdownMenuItem onClick={() => router.push("/orders")}>
            <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} />
            <span>View Orders</span>
          </DropdownMenuItem>
          {businessName && (
            <DropdownMenuItem onClick={handleViewLiveMenu}>
              <HugeiconsIcon icon={LiveStreaming02Icon} strokeWidth={2} />
              <span>View Live</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

