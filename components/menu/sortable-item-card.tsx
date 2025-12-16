"use client";

/* Convex */
import { Id } from "@/convex/_generated/dataModel";

/* DnD Kit */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* Components */
import ItemCard from "@/components/item-card";

interface SortableItemCardProps {
  itemId: Id<"menuItems">;
  itemName: string;
  itemPrice: string;
  itemDescription?: string;
  itemImage?: string;
  onEdit?: (newName: string, newPrice: string, newDescription: string, storageId?: string) => void;
  onDelete?: () => void;
}

export default function SortableItemCard({
  itemId,
  itemName,
  itemPrice,
  itemDescription,
  itemImage,
  onEdit,
  onDelete,
}: SortableItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border-b border-border/50 last:border-0">
      <ItemCard
        itemName={itemName}
        itemPrice={itemPrice}
        itemDescription={itemDescription}
        itemImage={itemImage}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

