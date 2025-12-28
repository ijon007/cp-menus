"use client";

/* Next */
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";

/* Components */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/utils/formatting";

function OrdersPageContent() {
  const accessStatus = useQuery(api.userAccess.checkAccess);
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const orders = useQuery(
    api.orders.getByBusinessInfoId,
    businessInfo ? { businessInfoId: businessInfo._id } : "skip"
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">
            View all orders placed by your customers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              All orders placed through your public menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell>
                          {order.customerName || "Anonymous"}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  x{item.quantity} @ {formatPrice(item.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatPrice(order.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Orders placed through your public menu will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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

