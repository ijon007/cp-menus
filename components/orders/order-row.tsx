"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableCell,
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
import { formatOrderDateMobile, formatOrderDateDesktop } from "@/utils/formatting";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon, CircleIcon, Tick02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import OrderRowExpanded from "./order-row-expanded";

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  _id: Id<"orders">;
  items: OrderItem[];
  totalPrice: string;
  status: string;
  createdAt: number;
}

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOrderDeleted: (orderId: Id<"orders">) => void;
}

export default function OrderRow({ order, isExpanded, onToggleExpand, onOrderDeleted }: OrderRowProps) {
  const updateStatus = useMutation(api.orders.updateStatus);
  const deleteOrder = useMutation(api.orders.deleteOrder);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleToggleComplete = async () => {
    try {
      const newStatus = order.status === "completed" ? "pending" : "completed";
      await updateStatus({ orderId: order._id, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder({ orderId: order._id });
      toast.success("Order deleted");
      setDeleteDialogOpen(false);
      onOrderDeleted(order._id);
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  return (
    <>
      <TableRow 
        className="cursor-pointer border-none transition-colors select-none"
        onClick={onToggleExpand}
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
                  variant="outline"
                  size="icon"
                  onClick={handleToggleComplete}
                  className="size-6"
                >
                  <HugeiconsIcon 
                    icon={order.status === "completed" ? CircleIcon : Tick02Icon} 
                    strokeWidth={3}
                    className={order.status === "completed" ? "text-primary" : "text-muted-foreground"}
                  />
                </Button>
              } />
              <TooltipContent>
                {order.status === "completed" ? "Mark as pending" : "Mark as completed"}
              </TooltipContent>
            </Tooltip>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <Tooltip>
                <AlertDialogTrigger render={
                  <TooltipTrigger render={
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-6 text-destructive border-destructive/50 hover:text-destructive"
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
                    onClick={handleDelete} 
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
        <OrderRowExpanded orderItems={order.items} />
      )}
    </>
  );
}

