"use client";

import type { WaiterTableNotesGroup } from "./types";
import { WaiterTableNotesCard } from "./waiter-table-notes-card";

interface WaiterNotesBoardProps {
  groups: WaiterTableNotesGroup[];
  onOpenTable: (tableNumber: number) => void;
}

export function WaiterNotesBoard({ groups, onOpenTable }: WaiterNotesBoardProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <WaiterTableNotesCard
          key={group.tableNumber}
          group={group}
          onOpen={onOpenTable}
        />
      ))}
    </div>
  );
}
