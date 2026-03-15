"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon } from "@hugeicons/core-free-icons";

interface WaiterHeaderProps {
  notificationCount: number;
}

export function WaiterHeader({ notificationCount }: WaiterHeaderProps) {
  const router = useRouter();

  const subtitle =
    notificationCount === 0
      ? "No notifications"
      : `${notificationCount} table${notificationCount !== 1 ? "s" : ""} waiting`;

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
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          Waiter View
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
