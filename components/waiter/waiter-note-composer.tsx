"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

interface WaiterNoteComposerProps {
  tableNumber: number;
  onAdd: (tableNumber: number, content: string) => Promise<void>;
}

export function WaiterNoteComposer({
  tableNumber,
  onAdd,
}: WaiterNoteComposerProps) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(tableNumber, trimmed);
      setValue("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pb-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add note..."
        className="h-8 text-sm"
      />
      <Button type="submit" className="h-8 px-3" disabled={isSubmitting || !value.trim()}>
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        Send
      </Button>
    </form>
  );
}
