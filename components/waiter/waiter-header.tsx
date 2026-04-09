"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon, Notification01Icon } from "@hugeicons/core-free-icons";
import { WaiterNewNoteDialog } from "./waiter-new-note-dialog";

interface WaiterHeaderProps {
  openNoteCount: number;
  callCount: number;
  onOpenCalls: () => void;
  suggestedTables: number[];
  onCreateNote: (tableNumber: number, content: string) => Promise<void>;
}

export function WaiterHeader({
  openNoteCount,
  callCount,
  onOpenCalls,
  suggestedTables,
  onCreateNote,
}: WaiterHeaderProps) {
  const router = useRouter();

  const subtitle =
    openNoteCount === 0
      ? "No notes"
      : `${openNoteCount} note${openNoteCount !== 1 ? "s" : ""}`;

  return (
    <div className="mb-3 flex items-center">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => router.push("/menu")}
      >
        <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={2} />
      </Button>
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Waiter Notes
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <WaiterNewNoteDialog
            suggestedTables={suggestedTables}
            onCreate={onCreateNote}
          />
          <Button variant="outline" size="sm" onClick={onOpenCalls}>
            <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
            Calls
            <Badge
              variant={callCount > 0 ? "secondary" : "outline"}
              className="h-4 min-w-4 rounded-full px-1 text-[10px] leading-none"
            >
              {callCount}
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}
