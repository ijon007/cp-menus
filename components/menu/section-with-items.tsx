"use client";

/* Next */
import { useState } from "react";

/* Convex */
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* DnD Kit */
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";

/* Components */
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CardTitle } from "@/components/ui/card";
import SectionActions from "@/components/section-actions";
import SortableItemCard from "./sortable-item-card";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";

interface SectionWithItemsProps {
  section: { _id: Id<"sections">; name: string };
  onEdit: (sectionId: Id<"sections">, newName: string) => void;
  onDelete: (sectionId: Id<"sections">) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export default function SectionWithItems({
  section,
  onEdit,
  onDelete,
  dragHandleProps,
}: SectionWithItemsProps) {
  const items = useQuery(api.menuItems.getBySectionId, { sectionId: section._id });
  const createItem = useMutation(api.menuItems.create);
  const updateItem = useMutation(api.menuItems.update);
  const deleteItem = useMutation(api.menuItems.remove);
  const reorderItems = useMutation(api.menuItems.reorderItems);
  const translateToAllLanguages = useAction(api.translate.translateToAllLanguages);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddItem = async (sectionId: Id<"sections">, itemName: string, itemPrice: string, itemDescription: string, storageId?: string) => {
    if (!itemName.trim()) return;

    setIsLoading(true);
    try {
      const [nameTranslations, descriptionTranslations] = await Promise.all([
        translateToAllLanguages({ text: itemName.trim(), sourceLanguage: "en" }),
        itemDescription.trim()
          ? translateToAllLanguages({ text: itemDescription.trim(), sourceLanguage: "en" })
          : Promise.resolve(null),
      ]);
      await createItem({
        sectionId,
        name: itemName.trim(),
        nameTranslations,
        price: itemPrice.trim(),
        description: itemDescription.trim() || undefined,
        descriptionTranslations: descriptionTranslations ?? undefined,
        storageId: storageId as Id<"_storage"> | undefined,
      });
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async (itemId: Id<"menuItems">, newName: string, newPrice: string, newDescription: string, storageId?: string) => {
    setIsLoading(true);
    try {
      const [nameTranslations, descriptionTranslations] = await Promise.all([
        translateToAllLanguages({ text: newName.trim(), sourceLanguage: "en" }),
        newDescription.trim()
          ? translateToAllLanguages({ text: newDescription.trim(), sourceLanguage: "en" })
          : Promise.resolve(null),
      ]);
      await updateItem({
        itemId,
        name: newName.trim(),
        nameTranslations,
        price: newPrice.trim(),
        description: newDescription.trim() || undefined,
        descriptionTranslations: descriptionTranslations ?? undefined,
        storageId: storageId as Id<"_storage"> | undefined,
      });
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: Id<"menuItems">) => {
    setIsLoading(true);
    try {
      await deleteItem({ itemId });
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  type Item = NonNullable<typeof items>[number];

  const handleItemsDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !items) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const oldIndex = items.findIndex((item: Item) => item._id === activeId);
    const newIndex = items.findIndex((item: Item) => item._id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove<Item>(items, oldIndex, newIndex);
    const itemOrders = newItems.map((item: Item, index) => ({
      itemId: item._id,
      newOrder: index,
    }));

    try {
      await reorderItems({
        sectionId: section._id,
        itemOrders,
      });
    } catch (error) {
      console.error("Error reordering items:", error);
    }
  };

  return (
    <Accordion className="border-border bg-card rounded-lg">
      <AccordionItem className="data-open:bg-card">
        <div className="flex min-w-0 items-center justify-between gap-2 px-2">
          <AccordionTrigger className="hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden cursor-pointer min-w-0 flex-1 px-0">
            <div className="flex min-w-0 flex-1 items-center gap-2 p-0">
              <div {...dragHandleProps} className="shrink-0 cursor-grab touch-none active:cursor-grabbing">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </div>
              <CardTitle className="text-foreground truncate text-base">{section.name}</CardTitle>
            </div>
          </AccordionTrigger>
          <SectionActions
            sectionId={section._id}
            sectionName={section.name}
            onEdit={(id, name) => onEdit(id as Id<"sections">, name)}
            onDelete={(id) => onDelete(id as Id<"sections">)}
            onAddItem={(id, name, price, desc, storageId) => handleAddItem(id as Id<"sections">, name, price, desc, storageId)}
          />
        </div>
        <AccordionContent className="[&_p:not(:last-child)]:mb-0 px-4">
          {items && items.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleItemsDragEnd}
            >
              <SortableContext items={items.map((item: Item) => item._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((item: Item) => (
                    <SortableItemCard
                      key={item._id}
                      itemId={item._id}
                      itemName={item.name}
                      itemPrice={item.price}
                      itemDescription={item.description}
                      itemImage={item.imageUrl || DEFAULT_IMAGES.MENU_ITEM}
                      onEdit={(newName, newPrice, newDescription, storageId) => {
                        handleEditItem(item._id, newName, newPrice, newDescription, storageId);
                      }}
                      onDelete={() => {
                        handleDeleteItem(item._id);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-muted-foreground text-sm">
              No items yet. Click "Add Item" to get started.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

