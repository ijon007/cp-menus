"use client";

import Link from "next/link";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Tick02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface OrdersPageHeaderProps {
  todayOrdersCount: number;
  onCompleteToday: () => Promise<void>;
  onClearToday: () => Promise<void>;
  onClearExpandedOrders: (orderIds: Id<"orders">[]) => void;
  orders: Array<{ _id: Id<"orders">; createdAt: number }> | undefined;
}

export default function OrdersPageHeader({
  todayOrdersCount,
  onCompleteToday,
  onClearToday,
  onClearExpandedOrders,
  orders,
}: OrdersPageHeaderProps) {
  const [clearTodayDialogOpen, setClearTodayDialogOpen] = useState(false);

  const handleClearToday = async () => {
    await onClearToday();
    setClearTodayDialogOpen(false);
    // Clear expanded orders if they were cleared
    if (orders) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStartTime = todayStart.getTime();
      const todayOrderIds = orders
        .filter((order) => order.createdAt >= todayStartTime)
        .map((order) => order._id);
      onClearExpandedOrders(todayOrderIds);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/menu">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
          </Link>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Orders</h2>
        </div>
        {todayOrdersCount > 0 && (
          <div className="flex items-center gap-1 md:gap-2">
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="outline" 
                  size="icon"
                  className="md:hidden size-7"
                  onClick={onCompleteToday}
                >
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
                </Button>
              } />
              <TooltipContent>Complete All</TooltipContent>
            </Tooltip>
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex"
              onClick={onCompleteToday}
            >
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
              Complete All
            </Button>
            <AlertDialog open={clearTodayDialogOpen} onOpenChange={setClearTodayDialogOpen}>
              <Tooltip>
                <TooltipTrigger render={
                  <AlertDialogTrigger render={
                    <Button variant="outline" size="icon" className="md:hidden size-7">
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    </Button>
                  } />
                } />
                <TooltipContent>Clear Today ({todayOrdersCount})</TooltipContent>
              </Tooltip>
              <AlertDialogTrigger render={
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  Clear Today ({todayOrdersCount})
                </Button>
              } />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Today's Orders</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete all {todayOrdersCount} order{todayOrdersCount !== 1 ? "s" : ""} from today? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearToday} variant="destructive" size="sm">
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    <span>Clear Orders</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}

