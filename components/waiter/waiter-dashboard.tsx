"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const deleteNoteMutation = useMutation(api.waiterNotes.deleteNote);

  const [search, setSearch] = useState("");
  const [isCallsOpen, setIsCallsOpen] = useState(false);
  const [activeTableNumber, setActiveTableNumber] = useState<number | null>(null);
  const [flashNoteId, setFlashNoteId] = useState<string | null>(null);

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
        const byCreatedDesc = [...tableNotes].sort((a, b) => b.createdAt - a.createdAt);
        const pendingCount = tableNotes.filter((n) => !n.isCompleted).length;
        const mostRecentlyTouched = tableNotes.reduce<WaiterNote | null>(
          (best, n) => (!best || n.updatedAt > best.updatedAt ? n : best),
          null
        );
        return {
          tableNumber,
          totalCount: tableNotes.length,
          pendingCount,
          completedCount: tableNotes.length - pendingCount,
          latestUpdatedAt: mostRecentlyTouched?.updatedAt ?? 0,
          preview: mostRecentlyTouched?.content ?? null,
          notes: byCreatedDesc,
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

  const suggestedTables = useMemo(() => {
    const seen = new Set<number>();

    for (const group of groups) {
      seen.add(group.tableNumber);
    }
    for (const notification of notifications) {
      seen.add(notification.tableNumber);
    }
    for (let i = 1; i <= 20; i += 1) {
      seen.add(i);
    }

    return [...seen].sort((a, b) => a - b);
  }, [groups, notifications]);

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
      const id = await addNoteMutation({ tableNumber, content });
      setFlashNoteId(String(id));
      toast.success(`Added note for Table ${tableNumber}`);
    } catch {
      toast.error("Failed to add note. Please try again.");
    }
  };

  useEffect(() => {
    if (!flashNoteId) return;
    const t = window.setTimeout(() => setFlashNoteId(null), 550);
    return () => window.clearTimeout(t);
  }, [flashNoteId]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <WaiterHeader
          openNoteCount={openNotesCount}
          callCount={notifications.length}
          onOpenCalls={() => setIsCallsOpen(true)}
          suggestedTables={suggestedTables}
          onCreateNote={async (tableNumber, content) => {
            await handleAddNote(tableNumber, content);
            setActiveTableNumber(tableNumber);
          }}
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
        <SheetContent
          side="bottom"
          className="data-[side=bottom]:h-[90vh] data-[side=bottom]:max-h-[90vh] p-0"
        >
          {activeTableGroup && (
            <>
              <SheetHeader className="shrink-0 px-4 pt-4 pb-3">
                <SheetTitle className="text-lg">Table {activeTableGroup.tableNumber}</SheetTitle>
                <SheetDescription>
                  {activeTableGroup.pendingCount} open / {activeTableGroup.completedCount} completed
                </SheetDescription>
              </SheetHeader>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
                  {activeTableGroup.notes.length > 0 ? (
                    <>
                      {activeTableGroup.notes.map((note) => (
                        <WaiterNoteItem
                          key={note.id}
                          note={note}
                          justAdded={flashNoteId === note.id}
                          onToggle={handleToggleNote}
                          onDelete={handleDeleteNote}
                        />
                      ))}
                      <div className="pointer-events-none border-t border-border/60" />
                      <div
                        className="pointer-events-none min-h-0 flex-1"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to bottom, transparent 0 31px, hsl(var(--border) / 0.6) 31px 32px)",
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex h-full min-h-[12rem] flex-col">
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        No notes yet for this table.
                      </p>
                      <div className="pointer-events-none border-t border-border/60" />
                      <div
                        className="pointer-events-none min-h-0 flex-1"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to bottom, transparent 0 31px, hsl(var(--border) / 0.6) 31px 32px)",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="shrink-0 bg-background px-4 pt-2 pb-4">
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
