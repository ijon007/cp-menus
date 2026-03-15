"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { WaiterHeader } from "./waiter-header";
import { WaiterToolbar } from "./waiter-toolbar";
import { WaiterNotificationList } from "./waiter-notification-list";
import { WaiterEmptyState } from "./waiter-empty-state";
import type { WaiterNotification } from "./types";

export function WaiterDashboard() {
  const rawCalls = useQuery(api.waiterCalls.listForCurrentBusiness);
  const confirmMutation = useMutation(api.waiterCalls.confirmWaiterCall);
  const clearMutation = useMutation(api.waiterCalls.clearWaiterCall);
  const [search, setSearch] = useState("");

  const notifications: WaiterNotification[] = useMemo(
    () =>
      (rawCalls ?? []).map((c) => ({
        id: c.id,
        tableNumber: c.tableNumber,
        triggeredAt: c.triggeredAt,
      })),
    [rawCalls]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return notifications;
    return notifications.filter((n) =>
      String(n.tableNumber).includes(search.trim())
    );
  }, [notifications, search]);

  const handleConfirm = async (id: string, tableNumber: number) => {
    try {
      await confirmMutation({ id: id as Id<"waiterCalls"> });
      toast.success(`Order taken — Table ${tableNumber}`);
    } catch {
      toast.error("Failed to confirm. Please try again.");
    }
  };

  const handleClear = async (id: string, tableNumber: number) => {
    try {
      await clearMutation({ id: id as Id<"waiterCalls"> });
      toast(`Notification cleared — Table ${tableNumber}`);
    } catch {
      toast.error("Failed to clear. Please try again.");
    }
  };

  const handleClearAll = async () => {
    const toClear = [...notifications];
    await Promise.all(
      toClear.map((n) => clearMutation({ id: n.id as Id<"waiterCalls"> }))
    );
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
