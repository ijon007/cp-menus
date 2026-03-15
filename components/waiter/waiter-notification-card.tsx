"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  Delete02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import type { WaiterNotification } from "./types";

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatElapsed(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 min ago";
  return `${diffMins} min ago`;
}

function getUrgencyVariant(
  timestamp: number
): "outline" | "secondary" | "destructive" {
  const diffMins = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMins >= 10) return "destructive";
  if (diffMins >= 5) return "secondary";
  return "outline";
}

interface WaiterNotificationCardProps {
  notification: WaiterNotification;
  onConfirm: (id: string, tableNumber: number) => void;
  onClear: (id: string, tableNumber: number) => void;
}

export function WaiterNotificationCard({
  notification,
  onConfirm,
  onClear,
}: WaiterNotificationCardProps) {
  const urgency = getUrgencyVariant(notification.triggeredAt);

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            Table {notification.tableNumber}
          </CardTitle>
          <Badge variant={urgency}>
            {formatElapsed(notification.triggeredAt)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <HugeiconsIcon
            icon={Clock01Icon}
            strokeWidth={2}
            className="size-3"
          />
          Called at {formatTime(notification.triggeredAt)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2 border-t pt-3">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onConfirm(notification.id, notification.tableNumber)}
        >
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          Confirm
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onClear(notification.id, notification.tableNumber)}
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
