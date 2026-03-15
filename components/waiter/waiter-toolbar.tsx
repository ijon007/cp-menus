"use client";

import { Input } from "@/components/ui/input";
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
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon } from "@hugeicons/core-free-icons";

interface WaiterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  notificationCount: number;
  onClearAll: () => void;
}

export function WaiterToolbar({
  search,
  onSearchChange,
  notificationCount,
  onClearAll,
}: WaiterToolbarProps) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <div className="relative flex-1">
        <HugeiconsIcon
          icon={SearchIcon}
          strokeWidth={2}
          className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search by table number…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-7 text-sm"
        />
      </div>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              disabled={notificationCount === 0}
            />
          }
        >
          Clear all
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {notificationCount} pending table
              notification{notificationCount !== 1 ? "s" : ""}. This action
              cannot be undone.
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
    </div>
  );
}
