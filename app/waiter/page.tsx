"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { WaiterDashboard } from "@/components/waiter/waiter-dashboard";

export default function WaiterPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <WaiterDashboard />
      </Authenticated>
    </>
  );
}
