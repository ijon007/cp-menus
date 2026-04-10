"use client";

import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon } from "@hugeicons/core-free-icons";

interface WaiterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function WaiterToolbar({
  search,
  onSearchChange,
}: WaiterToolbarProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="relative flex-1">
        <HugeiconsIcon
          icon={SearchIcon}
          strokeWidth={2}
          className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search by table or note…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-7 text-base md:h-7 md:text-sm"
        />
      </div>
    </div>
  );
}
