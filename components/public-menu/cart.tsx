"use client";

/* Next */
import { useState } from "react";

/* Convex */
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* Components */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "./cart-context";
import { formatPrice } from "@/utils/formatting";

/* Toast */
import { toast } from "sonner";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon, PlusSignIcon, MinusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";

interface CartProps {
  businessSlug: string;
  primaryColor?: string | null;
  accentColor?: string | null;
  secondaryColor?: string | null;
}

export default function Cart({ businessSlug, primaryColor, accentColor, secondaryColor }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const createOrder = useMutation(api.orders.createOrder);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    try {
      await createOrder({
        businessSlug,
        items: items.map((item) => ({
          itemId: item.itemId as Id<"menuItems">,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setIsOpen(false);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  return (
    <>
      <Button
        variant="default"
        size="icon-lg"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg"
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        onClick={() => setIsOpen(true)}
      >
        <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center"
          >
            {itemCount}
          </Badge>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg"
                    style={secondaryColor ? { borderColor: `${secondaryColor}30` } : undefined}
                  >
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold truncate"
                        style={primaryColor ? { color: primaryColor } : undefined}
                      >
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      >
                        <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      >
                        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(item.itemId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <SheetFooter className="flex-col gap-4">
              <div className="flex items-center justify-between w-full text-lg font-semibold">
                <span>Total:</span>
                <span
                  style={(accentColor || secondaryColor) ? { color: (accentColor || secondaryColor) || undefined } : undefined}
                >
                  {formatPrice(totalPrice.toFixed(2))}
                </span>
              </div>
              <Button
                className="w-full"
                style={primaryColor ? { backgroundColor: primaryColor } : undefined}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

