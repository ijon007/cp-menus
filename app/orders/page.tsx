"use client";

/* Next */
import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* Components */
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { formatPrice } from "@/utils/formatting";
import { toast } from "sonner";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Tick02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
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
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [clearTodayDialogOpen, setClearTodayDialogOpen] = useState(false);

  // Lazy load order details when expanded
  const orderDetails = useQuery(
    api.orders.getOrderDetails,
    expandedOrderId ? { orderId: expandedOrderId as Id<"orders"> } : "skip"
  );

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    } catch (error) {
      toast.error("Failed to clear today's orders");
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
      <div className="container mx-auto p-6">
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
              <h2 className="text-2xl font-semibold text-foreground">Orders</h2>
            </div>
            {todayOrdersCount > 0 && (
              <AlertDialog open={clearTodayDialogOpen} onOpenChange={setClearTodayDialogOpen}>
                <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  Clear Today ({todayOrdersCount})
                </AlertDialogTrigger>
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
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            View all orders placed by your customers
          </p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              // Use detailed items if expanded and loaded, otherwise use basic items
              const orderItems = isExpanded && orderDetails && orderDetails._id === order._id 
                ? orderDetails.items 
                : order.items.map(item => ({ ...item, imageUrl: null }));
              
              return (
                <Accordion 
                  key={order._id} 
                  className="border-border bg-card rounded-lg"
                >
                  <AccordionItem className="data-open:bg-card">
                    <div className="flex items-center justify-between gap-2 px-2">
                      <AccordionTrigger 
                        className="flex items-center justify-between hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden cursor-pointer flex-1 px-0"
                        onClick={() => {
                          if (!isExpanded) {
                            setExpandedOrderId(order._id);
                          } else {
                            setExpandedOrderId(null);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 p-0">
                          <CardTitle className="text-foreground text-base">
                            {formatDate(order.createdAt)}
                          </CardTitle>
                          
                          <span className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </span>
                          <Badge 
                            variant={"outline"}
                            className={cn("text-xs", order.status === "completed" ? "text-green-600 bg-green-600/10 border-green-600" : "")}
                          >
                            {order.status === "completed" ? "Completed" : "Pending"}
                          </Badge>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Tooltip>
                              <TooltipTrigger render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleComplete(order._id, order.status)}
                                  className="size-7"
                                >
                                  <HugeiconsIcon 
                                    icon={Tick02Icon} 
                                    strokeWidth={2}
                                    className={order.status === "completed" ? "text-green-600" : "text-muted-foreground"}
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
                                  Are you sure you want to delete this order from {formatDate(order.createdAt)}? This action cannot be undone.
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
                        </div>
                      </AccordionTrigger>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="text-base font-semibold pl-2">
                          {formatPrice(order.totalPrice)}
                        </div>
                      </div>
                    </div>
                    <AccordionContent className="[&_p:not(:last-child)]:mb-0 px-2">
                      {orderItems && orderItems.length > 0 ? (
                        <div className="space-y-2">
                          {orderItems.map((item, index) => {
                            const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
                            const itemTotal = itemPrice * item.quantity;
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between pb-2 py-2 gap-4 border-b border-border/50 last:border-b-0"
                              >
                                <div className="flex flex-row items-center gap-3">
                                  <div className="w-16 h-16 shrink-0 relative overflow-hidden rounded-md">
                                    <Image
                                      src={(item as any).imageUrl || DEFAULT_IMAGES.MENU_ITEM}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <p className="text-foreground font-medium text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-foreground font-medium">
                                      {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-foreground text-sm font-medium text-right">
                                  {formatPrice(itemTotal.toFixed(2))}
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}
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

