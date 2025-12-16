"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, SettingsIcon, Menu01Icon } from "@hugeicons/core-free-icons";
import { titleToSlug } from "@/lib/utils";

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
    <>
      {/* Desktop buttons - hidden on mobile */}
      <div className="hidden md:flex items-center gap-2">
        {businessName && (
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20"
            onClick={handleViewLiveMenu}
          >
            <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
            <span>View Live</span>
          </Button>
        )}
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20"
          onClick={() => router.push("/settings")}
        >
          <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
        </Button>
      </div>

      {/* Mobile menu - visible only on mobile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          />}>
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            {businessName && (
              <DropdownMenuItem onClick={handleViewLiveMenu}>
                <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
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
    </>
  );
}

