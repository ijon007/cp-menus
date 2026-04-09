"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { WaiterNote } from "./types";

interface WaiterNoteItemProps {
  note: WaiterNote;
  onToggle: (id: string, isCompleted: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WaiterNoteItem({ note, onToggle, onDelete }: WaiterNoteItemProps) {
  return (
    <div
      className="flex items-center gap-2 min-h-8 px-2"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, transparent calc(100% - 1px), hsl(var(--border) / 0.3) 1px)",
      }}
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
