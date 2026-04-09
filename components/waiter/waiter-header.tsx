"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon, Notification01Icon } from "@hugeicons/core-free-icons";

interface WaiterHeaderProps {
  openNoteCount: number;
  callCount: number;
  onOpenCalls: () => void;
}

export function WaiterHeader({
  openNoteCount,
  callCount,
  onOpenCalls,
}: WaiterHeaderProps) {
  const router = useRouter();

  const subtitle =
    openNoteCount === 0
      ? "No open notes"
      : `${openNoteCount} open note${openNoteCount !== 1 ? "s" : ""}`;

  return (
    <div className="mb-4 flex items-center">
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
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenCalls}>
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
          Calls
          <Badge variant={callCount > 0 ? "secondary" : "outline"}>
            {callCount}
          </Badge>
        </Button>
      </div>
    </div>
  );
}
