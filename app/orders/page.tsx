"use client";

/* React */
import { useState, useEffect } from "react";

/* Convex */
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* Components */
import { toast } from "sonner";
import LoadingState from "@/components/orders/loading-state";
import WaitingForApproval from "@/components/orders/waiting-for-approval";
import OrdersPageHeader from "@/components/orders/orders-page-header";
import OrdersTable from "@/components/orders/orders-table";
import EmptyOrdersState from "@/components/orders/empty-orders-state";

function OrdersPageContent() {
  const accessStatus = useQuery(api.userAccess.checkAccess);
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const orders = useQuery(
    api.orders.getByBusinessInfoId,
    businessInfo ? { businessInfoId: businessInfo._id } : "skip"
  );
  const clearTodayOrders = useMutation(api.orders.clearTodayOrders);
  const completeTodayOrders = useMutation(api.orders.completeTodayOrders);
  
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<Id<"orders">>>(new Set());

  // Clear expanded orders if they no longer exist
  useEffect(() => {
    if (expandedOrderIds.size > 0 && orders) {
      const orderIds = new Set(orders.map((order) => order._id));
      const validExpandedIds = new Set(
        Array.from(expandedOrderIds).filter((id) => orderIds.has(id))
      );
      if (validExpandedIds.size !== expandedOrderIds.size) {
        setExpandedOrderIds(validExpandedIds);
      }
    }
  }, [orders, expandedOrderIds]);

  // Show loading or waiting for approval message
  if (accessStatus === undefined || businessInfo === undefined || orders === undefined) {
    return <LoadingState />;
  }

  if (accessStatus && accessStatus.status !== "approved" && accessStatus.status !== null) {
    return <WaitingForApproval status={accessStatus.status === "pending" ? "pending" : "rejected"} />;
  }

  const handleClearToday = async () => {
    if (!businessInfo) return;
    try {
      const count = await clearTodayOrders({ businessInfoId: businessInfo._id });
      toast.success(`Cleared ${count} order${count !== 1 ? "s" : ""} from today`);
    } catch (error) {
      toast.error("Failed to clear today's orders");
      console.error(error);
    }
  };

  const handleCompleteToday = async () => {
    if (!businessInfo) return;
    try {
      const count = await completeTodayOrders({ businessInfoId: businessInfo._id });
      toast.success(`Marked ${count} order${count !== 1 ? "s" : ""} as completed`);
    } catch (error) {
      toast.error("Failed to complete today's orders");
      console.error(error);
    }
  };

  const isToday = (timestamp: number) => {
    const today = new Date();
    const orderDate = new Date(timestamp);
    return (
      today.getDate() === orderDate.getDate() &&
      today.getMonth() === orderDate.getMonth() &&
      today.getFullYear() === orderDate.getFullYear()
    );
  };

  const todayOrdersCount = orders?.filter((order) => isToday(order.createdAt)).length || 0;

  const handleToggleExpand = (orderId: Id<"orders">) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleOrderDeleted = (orderId: Id<"orders">) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  };

  const handleClearExpandedOrders = (orderIds: Id<"orders">[]) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      orderIds.forEach((id) => newSet.delete(id));
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-3">
        <OrdersPageHeader
          todayOrdersCount={todayOrdersCount}
          onCompleteToday={handleCompleteToday}
          onClearToday={handleClearToday}
          onClearExpandedOrders={handleClearExpandedOrders}
          orders={orders}
        />

        {orders && orders.length > 0 ? (
          <OrdersTable
            orders={orders}
            expandedOrderIds={expandedOrderIds}
            onToggleExpand={handleToggleExpand}
            onOrderDeleted={handleOrderDeleted}
          />
        ) : (
          <EmptyOrdersState />
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <OrdersPageContent />
      </Authenticated>
    </>
  );
}

