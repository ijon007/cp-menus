"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionWithItems from "./section-with-items";

interface SortableSectionProps {
  section: { _id: Id<"sections">; name: string };
}

export default function SortableSection({
  section,
}: SortableSectionProps) {
  const updateSection = useMutation(api.sections.update);
  const deleteSection = useMutation(api.sections.remove);
  const [isLoading, setIsLoading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = async (sectionId: Id<"sections">, newName: string) => {
    if (!newName.trim()) return;
    
    setIsLoading(true);
    try {
      await updateSection({ sectionId, name: newName.trim() });
    } catch (error) {
      console.error("Error updating section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (sectionId: Id<"sections">) => {
    setIsLoading(true);
    try {
      await deleteSection({ sectionId });
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionWithItems
        section={section}
        onEdit={handleEdit}
        onDelete={handleDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

