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
  title?: string;
  description?: string;
}

export function WaiterEmptyState({
  hasSearch,
  searchValue,
  onClearSearch,
  title,
  description,
}: WaiterEmptyStateProps) {
  const resolvedTitle = title ?? (hasSearch ? "No tables match your search" : "All clear");
  const resolvedDescription =
    description ??
    (hasSearch
      ? `No table number contains "${searchValue}". Try a different number.`
      : "No pending table notifications. New requests will appear here.");

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
          <EmptyTitle>{resolvedTitle}</EmptyTitle>
          <EmptyDescription>{resolvedDescription}</EmptyDescription>
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
