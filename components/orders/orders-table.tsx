import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderRow from "./order-row";
import { Id } from "@/convex/_generated/dataModel";

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

interface OrdersTableProps {
  orders: Order[];
  expandedOrderIds: Set<Id<"orders">>;
  onToggleExpand: (orderId: Id<"orders">) => void;
  onOrderDeleted: (orderId: Id<"orders">) => void;
}

export default function OrdersTable({
  orders,
  expandedOrderIds,
  onToggleExpand,
  onOrderDeleted,
}: OrdersTableProps) {
  return (
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
            return (
              <OrderRow
                key={order._id}
                order={order}
                isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpand(order._id)}
                onOrderDeleted={onOrderDeleted}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

