import type { WaiterNotification } from "./types";

const now = Date.now();

export const MOCK_NOTIFICATIONS: WaiterNotification[] = [
  { id: "notif-1", tableNumber: 3, triggeredAt: now - 1 * 60 * 1000 },
  { id: "notif-2", tableNumber: 7, triggeredAt: now - 4 * 60 * 1000 },
  { id: "notif-3", tableNumber: 12, triggeredAt: now - 7 * 60 * 1000 },
  { id: "notif-4", tableNumber: 5, triggeredAt: now - 11 * 60 * 1000 },
  { id: "notif-5", tableNumber: 9, triggeredAt: now - 18 * 60 * 1000 },
];
