"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";

interface CallWaiterFABProps {
  restaurantSlug: string;
  tableNumber: number | null;
  primaryColor?: string | null;
  accentColor?: string | null;
}

export function CallWaiterFAB({
  restaurantSlug,
  tableNumber,
  primaryColor,
  accentColor,
}: CallWaiterFABProps) {
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const callWaiter = useMutation(api.waiterCalls.callWaiter);

  const buttonColor = accentColor || primaryColor || "#000000";

  const handleCall = async () => {
    if (!tableNumber || calling || called) return;

    setCalling(true);
    try {
      await callWaiter({ slug: restaurantSlug, tableNumber });
      setCalled(true);
      toast.success(`Waiter called for Table ${tableNumber}`);
      setTimeout(() => setCalled(false), 30000);
    } catch {
      toast.error("Could not call waiter. Please try again.");
    } finally {
      setCalling(false);
    }
  };

  const disabled = !tableNumber || calling || called;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <button
        onClick={handleCall}
        disabled={disabled}
        aria-label={
          tableNumber
            ? called
              ? `Waiter called for Table ${tableNumber}`
              : `Call waiter for Table ${tableNumber}`
            : "Open from your table's QR code to call the waiter"
        }
        title={
          tableNumber
            ? called
              ? `Waiter already called for Table ${tableNumber}`
              : `Call waiter for Table ${tableNumber}`
            : "Scan your table's QR code to call the waiter"
        }
        style={{
          backgroundColor: buttonColor,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <HugeiconsIcon
          icon={Notification01Icon}
          strokeWidth={2}
          className="size-6 text-white"
        />
      </button>
    </div>
  );
}
