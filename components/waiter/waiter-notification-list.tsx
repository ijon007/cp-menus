"use client";

import { WaiterNotificationCard } from "./waiter-notification-card";
import type { WaiterNotification } from "./types";

interface WaiterNotificationListProps {
  notifications: WaiterNotification[];
  onConfirm: (id: string, tableNumber: number) => void;
  onClear: (id: string, tableNumber: number) => void;
  compact?: boolean;
}

export function WaiterNotificationList({
  notifications,
  onConfirm,
  onClear,
  compact = false,
}: WaiterNotificationListProps) {
  return (
    <div className={compact ? "space-y-1.5" : "grid gap-3 sm:grid-cols-2"}>
      {notifications.map((notif) => (
        <WaiterNotificationCard
          key={notif.id}
          notification={notif}
          onConfirm={onConfirm}
          onClear={onClear}
          compact={compact}
        />
      ))}
    </div>
  );
}
