import { TableCell, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/utils/formatting";

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

interface OrderRowExpandedProps {
  orderItems: OrderItem[];
}

export default function OrderRowExpanded({ orderItems }: OrderRowExpandedProps) {
  return (
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
  );
}

