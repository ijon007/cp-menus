export type WaiterNotification = {
  id: string;
  tableNumber: number;
  triggeredAt: number;
};

export type WaiterNote = {
  id: string;
  tableNumber: number;
  content: string;
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
};

export type WaiterTableNotesGroup = {
  tableNumber: number;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  latestUpdatedAt: number;
  preview: string | null;
  notes: WaiterNote[];
};
