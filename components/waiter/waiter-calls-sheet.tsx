"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { WaiterNotificationList } from "./waiter-notification-list";
import { WaiterEmptyState } from "./waiter-empty-state";
import type { WaiterNotification } from "./types";

interface WaiterCallsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: WaiterNotification[];
  onConfirm: (id: string, tableNumber: number) => void;
  onClear: (id: string, tableNumber: number) => void;
  onClearAll: () => void;
}

export function WaiterCallsSheet({
  open,
  onOpenChange,
  notifications,
  onConfirm,
  onClear,
  onClearAll,
}: WaiterCallsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[95vw] sm:max-w-md p-0"
      >
        <SheetHeader className="border-b px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <SheetTitle>Waiter Calls</SheetTitle>
              <SheetDescription>
                {notifications.length} active call{notifications.length !== 1 ? "s" : ""}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-1">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={notifications.length === 0}
                    />
                  }
                >
                  Clear all
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all waiter calls?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes all active table calls.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      size="sm"
                      variant="destructive"
                      onClick={onClearAll}
                    >
                      Clear all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close waiter calls"
                  />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <div className="p-2.5">
          {notifications.length > 0 ? (
            <WaiterNotificationList
              notifications={notifications}
              onConfirm={onConfirm}
              onClear={onClear}
              compact
            />
          ) : (
            <WaiterEmptyState
              hasSearch={false}
              searchValue=""
              onClearSearch={() => {}}
              title="No waiter calls"
              description="New table calls will appear here."
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
