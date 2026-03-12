"use client";

import { ReactNode, useState } from "react";
import { useLanguage } from "./useLanguage";
import RestaurantHeader from "@/components/public-menu/restaurant-header";
import MenuHeaderActions from "@/components/menu/menu-header-actions";
import AddSectionDialog from "@/components/menu/add-section-dialog";
import EmptySectionsMessage from "@/components/menu/empty-sections-message";
import SortableSection from "@/components/menu/sortable-section";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

interface LiveMenuClientProps {
  businessInfo: {
    _id: Id<"businessInfo">;
    businessName: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    googleReviewUrl?: string | null;
    tripAdvisorReviewUrl?: string | null;
    socialLinks?: {
      instagram?: string | null;
      facebook?: string | null;
    } | null;
  } | null | undefined;
  sections:
    | {
        _id: Id<"sections">;
        name: string;
        order: number;
      }[]
    | null
    | undefined;
  actions?: ReactNode;
}

export default function LiveMenuClient({ businessInfo, sections }: LiveMenuClientProps) {
  const { language, setLanguage, t, hydrated } = useLanguage();
  const reorderSections = useMutation(api.sections.reorderSections);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSectionsDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !businessInfo || !sections) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const oldIndex = sections.findIndex((s) => s._id === activeId);
    const newIndex = sections.findIndex((s) => s._id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSections = arrayMove(sections, oldIndex, newIndex);
    const sectionOrders = newSections.map((section, index) => ({
      sectionId: section._id,
      newOrder: index,
    }));

    try {
      await reorderSections({
        businessInfoId: businessInfo._id,
        sectionOrders,
      });
    } catch (error) {
      console.error("Error reordering sections:", error);
    }
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader
        businessName={businessInfo?.businessName || "My Restaurant"}
        logoUrl={businessInfo?.logoUrl}
        bannerUrl={businessInfo?.bannerUrl}
        googleReviewUrl={businessInfo?.googleReviewUrl}
        tripAdvisorReviewUrl={businessInfo?.tripAdvisorReviewUrl}
        socialLinks={businessInfo?.socialLinks}
        actions={
          <div className="flex items-center gap-4">
            <select
              aria-label={t.languageSelectorLabel}
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
            >
              <option value="en" aria-label={t.languageEnglish}>
                <span aria-hidden="true" className="fi fi-gb fis" />
              </option>
              <option value="sq" aria-label={t.languageAlbanian}>
                <span aria-hidden="true" className="fi fi-al fis" />
              </option>
              <option value="it" aria-label={t.languageItalian}>
                <span aria-hidden="true" className="fi fi-it fis" />
              </option>
            </select>
            <MenuHeaderActions businessName={businessInfo?.businessName} />
          </div>
        }
      />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">{t.menuTitle}</h2>
          <AddSectionDialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen} />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionsDragEnd}>
          <SortableContext items={sections?.map((s) => s._id) || []} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {sections && sections.length > 0 ? (
                sections.map((section) => (
                  <SortableSection
                    key={section._id}
                    section={section}
                  />
                ))
              ) : (
                <EmptySectionsMessage />
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

