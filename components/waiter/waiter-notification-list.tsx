"use client";

import { WaiterNotificationCard } from "./waiter-notification-card";
import type { WaiterNotification } from "./types";

interface WaiterNotificationListProps {
  notifications: WaiterNotification[];
  onConfirm: (id: string, tableNumber: number) => void;
  onClear: (id: string, tableNumber: number) => void;
}

export function WaiterNotificationList({
  notifications,
  onConfirm,
  onClear,
}: WaiterNotificationListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {notifications.map((notif) => (
        <WaiterNotificationCard
          key={notif.id}
          notification={notif}
          onConfirm={onConfirm}
          onClear={onClear}
        />
      ))}
    </div>
  );
}
