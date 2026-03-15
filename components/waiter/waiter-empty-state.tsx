"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, NotificationOff01Icon } from "@hugeicons/core-free-icons";

interface WaiterEmptyStateProps {
  hasSearch: boolean;
  searchValue: string;
  onClearSearch: () => void;
}

export function WaiterEmptyState({
  hasSearch,
  searchValue,
  onClearSearch,
}: WaiterEmptyStateProps) {
  return (
    <Empty className="border mt-8">
      <EmptyContent>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon
              icon={hasSearch ? SearchIcon : NotificationOff01Icon}
              strokeWidth={2}
            />
          </EmptyMedia>
          <EmptyTitle>
            {hasSearch ? "No tables match your search" : "All clear"}
          </EmptyTitle>
          <EmptyDescription>
            {hasSearch
              ? `No table number contains "${searchValue}". Try a different number.`
              : "No pending table notifications. New requests will appear here."}
          </EmptyDescription>
        </EmptyHeader>
        {hasSearch && (
          <Button size="sm" variant="outline" onClick={onClearSearch}>
            Clear search
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
