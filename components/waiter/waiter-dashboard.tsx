"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { WaiterHeader } from "./waiter-header";
import { WaiterToolbar } from "./waiter-toolbar";
import { WaiterEmptyState } from "./waiter-empty-state";
import { WaiterNotesBoard } from "./waiter-notes-board";
import { WaiterNoteItem } from "./waiter-note-item";
import { WaiterNoteComposer } from "./waiter-note-composer";
import { WaiterCallsSheet } from "./waiter-calls-sheet";
import type { WaiterNote, WaiterNotification, WaiterTableNotesGroup } from "./types";

export function WaiterDashboard() {
  const rawCalls = useQuery(api.waiterCalls.listForCurrentBusiness);
  const rawNotes = useQuery(api.waiterNotes.listByBusiness, {});
  const confirmMutation = useMutation(api.waiterCalls.confirmWaiterCall);
  const clearMutation = useMutation(api.waiterCalls.clearWaiterCall);
  const addNoteMutation = useMutation(api.waiterNotes.addNote);
  const toggleNoteMutation = useMutation(api.waiterNotes.toggleNoteComplete);
  const clearCompletedMutation = useMutation(api.waiterNotes.clearCompletedByTable);
  const deleteNoteMutation = useMutation(api.waiterNotes.deleteNote);

  const [search, setSearch] = useState("");
  const [isCallsOpen, setIsCallsOpen] = useState(false);
  const [activeTableNumber, setActiveTableNumber] = useState<number | null>(null);

  const notifications: WaiterNotification[] = useMemo(
    () =>
      (rawCalls ?? []).map((c) => ({
        id: c.id,
        tableNumber: c.tableNumber,
        triggeredAt: c.triggeredAt,
      })),
    [rawCalls]
  );

  const notes: WaiterNote[] = useMemo(
    () =>
      (rawNotes ?? []).map((n) => ({
        id: n.id,
        tableNumber: n.tableNumber,
        content: n.content,
        isCompleted: n.isCompleted,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
        completedAt: n.completedAt,
      })),
    [rawNotes]
  );

  const groups = useMemo<WaiterTableNotesGroup[]>(() => {
    const byTable = new Map<number, WaiterNote[]>();
    for (const note of notes) {
      const existing = byTable.get(note.tableNumber) ?? [];
      existing.push(note);
      byTable.set(note.tableNumber, existing);
    }

    return [...byTable.entries()]
      .map(([tableNumber, tableNotes]) => {
        const sorted = [...tableNotes].sort((a, b) => b.updatedAt - a.updatedAt);
        const pendingCount = sorted.filter((n) => !n.isCompleted).length;
        return {
          tableNumber,
          totalCount: sorted.length,
          pendingCount,
          completedCount: sorted.length - pendingCount,
          latestUpdatedAt: sorted[0]?.updatedAt ?? 0,
          preview: sorted[0]?.content ?? null,
          notes: sorted,
        };
      })
      .sort((a, b) => b.latestUpdatedAt - a.latestUpdatedAt);
  }, [notes]);

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((group) => {
      if (String(group.tableNumber).includes(term)) return true;
      return group.notes.some((note) => note.content.toLowerCase().includes(term));
    });
  }, [groups, search]);

  const activeTableGroup = useMemo(
    () => groups.find((group) => group.tableNumber === activeTableNumber) ?? null,
    [groups, activeTableNumber]
  );

  const openNotesCount = useMemo(
    () => notes.filter((note) => !note.isCompleted).length,
    [notes]
  );

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

  const handleAddNote = async (tableNumber: number, content: string) => {
    try {
      await addNoteMutation({ tableNumber, content });
      toast.success(`Added note for Table ${tableNumber}`);
    } catch {
      toast.error("Failed to add note. Please try again.");
    }
  };

  const handleToggleNote = async (id: string, isCompleted: boolean) => {
    try {
      await toggleNoteMutation({
        id: id as Id<"waiterNotes">,
        isCompleted,
      });
    } catch {
      toast.error("Failed to update note.");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNoteMutation({ id: id as Id<"waiterNotes"> });
      toast("Note removed");
    } catch {
      toast.error("Failed to remove note.");
    }
  };

  const handleClearCompleted = async (tableNumber: number) => {
    try {
      const result = await clearCompletedMutation({ tableNumber });
      toast(`Cleared ${result.deleted} completed note${result.deleted === 1 ? "" : "s"}`);
    } catch {
      toast.error("Failed to clear completed notes.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <WaiterHeader
          openNoteCount={openNotesCount}
          callCount={notifications.length}
          onOpenCalls={() => setIsCallsOpen(true)}
        />
        <WaiterToolbar
          search={search}
          onSearchChange={setSearch}
        />
        {filteredGroups.length > 0 ? (
          <WaiterNotesBoard
            groups={filteredGroups}
            onOpenTable={setActiveTableNumber}
          />
        ) : (
          <WaiterEmptyState
            hasSearch={search.length > 0}
            searchValue={search}
            onClearSearch={() => setSearch("")}
            title={search.trim() ? undefined : "No table notes yet"}
            description={
              search.trim()
                ? undefined
                : "Start by opening a table and adding your first note."
            }
          />
        )}
      </div>

      <WaiterCallsSheet
        open={isCallsOpen}
        onOpenChange={setIsCallsOpen}
        notifications={notifications}
        onConfirm={handleConfirm}
        onClear={handleClear}
        onClearAll={handleClearAll}
      />

      <Sheet
        open={activeTableNumber !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActiveTableNumber(null);
          }
        }}
      >
        <SheetContent side="bottom" className="h-[82vh] sm:h-[75vh] p-0">
          {activeTableGroup && (
            <>
              <SheetHeader className="border-b">
                <SheetTitle>Table {activeTableGroup.tableNumber}</SheetTitle>
                <SheetDescription>
                  {activeTableGroup.pendingCount} open / {activeTableGroup.completedCount} completed
                </SheetDescription>
              </SheetHeader>

              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                  {activeTableGroup.notes.length > 0 ? (
                    activeTableGroup.notes.map((note) => (
                      <WaiterNoteItem
                        key={note.id}
                        note={note}
                        onToggle={handleToggleNote}
                        onDelete={handleDeleteNote}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      No notes yet for this table.
                    </p>
                  )}
                </div>
                <div className="border-t bg-background px-4 py-3 space-y-2">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClearCompleted(activeTableGroup.tableNumber)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                      Clear completed
                    </Button>
                  </div>
                  <WaiterNoteComposer
                    tableNumber={activeTableGroup.tableNumber}
                    onAdd={handleAddNote}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
