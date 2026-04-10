"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import type { WaiterTableNotesGroup } from "./types";

interface WaiterTableNotesCardProps {
  group: WaiterTableNotesGroup;
  onOpen: (tableNumber: number) => void;
}

export function WaiterTableNotesCard({ group, onOpen }: WaiterTableNotesCardProps) {
  return (
    <button type="button" className="w-full text-left" onClick={() => onOpen(group.tableNumber)}>
      <Card size="sm" className="transition hover:border-foreground/25 hover:ring-foreground/10 p-0">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="inline-flex size-4 items-center justify-center rounded-sm bg-muted text-muted-foreground">
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-3" />
              </span>
              <CardTitle className="text-sm font-medium leading-none">
                Table {group.tableNumber}
              </CardTitle>
            </div>
            <Badge variant={group.pendingCount > 0 ? "secondary" : "outline"}>
              {group.totalCount} item{group.totalCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
      </Card>
    </button>
  );
}
