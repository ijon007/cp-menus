"use client";

/* Next */
import { useRouter } from "next/navigation";

/* Components */
import { Button } from "@/components/ui/button";

/* Utils */
import { titleToSlug } from "@/lib/utils";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { SettingsIcon, LiveStreaming02Icon } from "@hugeicons/core-free-icons";

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
      {businessName && (
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20"
          onClick={handleViewLiveMenu}
        >
          <HugeiconsIcon icon={LiveStreaming02Icon} strokeWidth={2} />
          <span className="hidden md:block">View Live</span>
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
  );
}

