"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { WaiterHeader } from "./waiter-header";
import { WaiterToolbar } from "./waiter-toolbar";
import { WaiterNotificationList } from "./waiter-notification-list";
import { WaiterEmptyState } from "./waiter-empty-state";
import { MOCK_NOTIFICATIONS } from "./constants";
import type { WaiterNotification } from "./types";

export function WaiterDashboard() {
  const [notifications, setNotifications] =
    useState<WaiterNotification[]>(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return notifications;
    return notifications.filter((n) =>
      String(n.tableNumber).includes(search.trim())
    );
  }, [notifications, search]);

  const handleConfirm = (id: string, tableNumber: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success(`Order taken — Table ${tableNumber}`);
  };

  const handleClear = (id: string, tableNumber: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast(`Notification cleared — Table ${tableNumber}`);
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast("All notifications cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <WaiterHeader notificationCount={notifications.length} />
        <WaiterToolbar
          search={search}
          onSearchChange={setSearch}
          notificationCount={notifications.length}
          onClearAll={handleClearAll}
        />
        {filtered.length > 0 ? (
          <WaiterNotificationList
            notifications={filtered}
            onConfirm={handleConfirm}
            onClear={handleClear}
          />
        ) : (
          <WaiterEmptyState
            hasSearch={search.length > 0}
            searchValue={search}
            onClearSearch={() => setSearch("")}
          />
        )}
      </div>
    </div>
  );
}
