"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

interface WaiterNewNoteDialogProps {
  suggestedTables: number[];
  onCreate: (tableNumber: number, content: string) => Promise<void>;
}

export function WaiterNewNoteDialog({
  suggestedTables,
  onCreate,
}: WaiterNewNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<number>(suggestedTables[0] ?? 1);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tableOptions = useMemo(() => {
    if (suggestedTables.length > 0) return suggestedTables;
    return Array.from({ length: 20 }, (_, idx) => idx + 1);
  }, [suggestedTables]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || tableNumber < 1 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreate(tableNumber, trimmed);
      setContent("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        New note
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create note</DialogTitle>
          <DialogDescription>Select a table and add the note.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Table</label>
            <select
              value={String(tableNumber)}
              onChange={(event) => setTableNumber(Number(event.target.value))}
              className="bg-input/20 dark:bg-input/30 border-input h-7 w-full rounded-md border px-2 text-sm outline-none"
            >
              {tableOptions.map((table) => (
                <option key={table} value={table}>
                  Table {table}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Note</label>
            <Input
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Add note..."
              className="h-8 text-sm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
