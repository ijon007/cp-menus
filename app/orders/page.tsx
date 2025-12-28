"use client";

/* Next */
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* Components */
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatPrice, formatOrderDateMobile, formatOrderDateDesktop } from "@/utils/formatting";
import { toast } from "sonner";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Tick02Icon, Delete02Icon, ArrowDown01Icon, ArrowUp01Icon, CircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

function OrdersPageContent() {
  const accessStatus = useQuery(api.userAccess.checkAccess);
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const orders = useQuery(
    api.orders.getByBusinessInfoId,
    businessInfo ? { businessInfoId: businessInfo._id } : "skip"
  );
  const updateStatus = useMutation(api.orders.updateStatus);
  const deleteOrder = useMutation(api.orders.deleteOrder);
  const clearTodayOrders = useMutation(api.orders.clearTodayOrders);
  const completeTodayOrders = useMutation(api.orders.completeTodayOrders);
  
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<Id<"orders">>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [clearTodayDialogOpen, setClearTodayDialogOpen] = useState(false);

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (accessStatus && accessStatus.status !== "approved" && accessStatus.status !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Waiting for Approval
              </h1>
              <p className="text-muted-foreground">
                Your access request is {accessStatus.status === "pending" ? "pending" : "rejected"}. 
                Please wait for an administrator to review your request.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const handleToggleComplete = async (orderId: Id<"orders">, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await updateStatus({ orderId, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  const handleDelete = async (orderId: Id<"orders">) => {
    try {
      await deleteOrder({ orderId });
      toast.success("Order deleted");
      setDeleteDialogOpen(null);
      // Clear expanded order if it was the one deleted
      setExpandedOrderIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  const handleClearToday = async () => {
    if (!businessInfo) return;
    try {
      const count = await clearTodayOrders({ businessInfoId: businessInfo._id });
      toast.success(`Cleared ${count} order${count !== 1 ? "s" : ""} from today`);
      setClearTodayDialogOpen(false);
      // Clear expanded orders if they were cleared
      if (orders) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayStartTime = todayStart.getTime();
        const todayOrderIds = orders
          .filter((order) => order.createdAt >= todayStartTime)
          .map((order) => order._id);
        setExpandedOrderIds((prev) => {
          const newSet = new Set(prev);
          todayOrderIds.forEach((id) => newSet.delete(id));
          return newSet;
        });
      }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-3">
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
                      onClick={handleCompleteToday}
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
                  onClick={handleCompleteToday}
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

        {orders && orders.length > 0 ? (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-card">
                  <TableHead className="w-[50px] font-semibold"></TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const isExpanded = expandedOrderIds.has(order._id);
                  // Items already have imageUrl loaded upfront from backend
                  const orderItems = order.items;
                
                  return (
                    <React.Fragment key={order._id}>
                      <TableRow 
                        className="cursor-pointer border-none transition-colors select-none"
                        onClick={() => {
                          setExpandedOrderIds((prev) => {
                            const newSet = new Set(prev);
                            if (isExpanded) {
                              newSet.delete(order._id);
                            } else {
                              newSet.add(order._id);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <TableCell className="py-4">
                          <HugeiconsIcon 
                            icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                            className="text-muted-foreground size-4"
                            strokeWidth={2}
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-medium">
                            <span className="md:hidden">{formatOrderDateMobile(order.createdAt)}</span>
                            <span className="hidden md:inline">{formatOrderDateDesktop(order.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-4">
                          <Badge 
                            variant={"outline"}
                            className={cn("text-xs", order.status === "completed" ? "text-green-600 bg-green-600/10 border-green-600" : "")}
                          >
                            {order.status === "completed" ? "Completed" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium py-4">
                          {Math.round(Number(order.totalPrice))} Lek
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Tooltip>
                              <TooltipTrigger render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleComplete(order._id, order.status)}
                                  className="size-7"
                                >
                                  <HugeiconsIcon 
                                    icon={order.status === "completed" ? CircleIcon : Tick02Icon} 
                                    strokeWidth={2}
                                    className={order.status === "completed" ? "text-destructive" : "text-muted-foreground"}
                                  />
                                </Button>
                              } />
                              <TooltipContent>
                                {order.status === "completed" ? "Mark as pending" : "Mark as completed"}
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialog open={deleteDialogOpen === order._id} onOpenChange={(open) => setDeleteDialogOpen(open ? order._id : null)}>
                              <Tooltip>
                                <AlertDialogTrigger render={
                                  <TooltipTrigger render={
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="size-7 text-destructive hover:text-destructive"
                                    >
                                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                                    </Button>
                                  } />
                                } />
                                <TooltipContent>
                                  Delete order
                                </TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this order from {formatOrderDateDesktop(order.createdAt)}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(order._id)} 
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                                    <span>Delete</span>
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow className="border-b border-border">
                          <TableCell colSpan={6} className="p-4 hover:bg-card">
                            {orderItems && orderItems.length > 0 ? (
                              <div className="space-y-2">
                                {orderItems.map((item, index) => {
                                  const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
                                  const itemTotal = itemPrice * item.quantity;
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between gap-4 border-b pb-2 last:pb-0 border-border/50 last:border-b-0"
                                    >
                                      <div className="flex flex-row items-center gap-3">
                                        <div className="flex flex-col gap-0.5">
                                          <p className="text-foreground font-medium text-sm">
                                            {item.name}
                                          </p>
                                          <p className="text-foreground font-medium text-xs">
                                            {item.quantity} × {formatPrice(item.price)}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-foreground text-xs font-medium text-right">
                                        {Math.round(itemTotal)} Lek
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">
                                No items in this order.
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border border-border bg-card rounded-lg p-12">
            <div className="text-center">
              <p className="text-muted-foreground">No orders yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Orders placed through your public menu will appear here.
              </p>
            </div>
          </div>
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

