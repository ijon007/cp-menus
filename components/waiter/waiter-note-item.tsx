"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { WaiterNote } from "./types";

interface WaiterNoteItemProps {
  note: WaiterNote;
  justAdded?: boolean;
  onToggle: (id: string, isCompleted: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WaiterNoteItem({
  note,
  justAdded,
  onToggle,
  onDelete,
}: WaiterNoteItemProps) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 border-t border-border/60 px-2",
        justAdded && "animate-waiter-note-enter"
      )}
    >
      <Checkbox
        checked={note.isCompleted}
        onCheckedChange={(checked) => onToggle(note.id, Boolean(checked))}
        aria-label={`Mark note for table ${note.tableNumber} as complete`}
      />
      <p
        className={cn(
          "flex-1 text-sm leading-6 text-foreground",
          note.isCompleted && "text-muted-foreground line-through"
        )}
      >
        {note.content}
      </p>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(note.id)}
        aria-label="Delete note"
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
      </Button>
    </div>
  );
}
