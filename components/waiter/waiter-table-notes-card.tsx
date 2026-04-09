"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { WaiterTableNotesGroup } from "./types";

interface WaiterTableNotesCardProps {
  group: WaiterTableNotesGroup;
  onOpen: (tableNumber: number) => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WaiterTableNotesCard({ group, onOpen }: WaiterTableNotesCardProps) {
  return (
    <button type="button" className="text-left" onClick={() => onOpen(group.tableNumber)}>
      <Card size="sm" className="transition hover:ring-foreground/20">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold">Table {group.tableNumber}</CardTitle>
            <Badge variant={group.pendingCount > 0 ? "secondary" : "outline"}>
              {group.pendingCount} open
            </Badge>
          </div>
          <CardDescription className="space-y-1">
            <p className="truncate">
              {group.preview ?? "No notes yet"}
            </p>
            <p>Updated {formatTime(group.latestUpdatedAt)}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
}
