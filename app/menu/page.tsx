"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import RestaurantHeader from "@/components/public-menu/restaurant-header";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSection from "@/components/menu/sortable-section";
import BusinessNameDialog from "@/components/menu/business-name-dialog";
import AddSectionDialog from "@/components/menu/add-section-dialog";
import MenuHeaderActions from "@/components/menu/menu-header-actions";
import EmptySectionsMessage from "@/components/menu/empty-sections-message";

function AdminMenuPage() {
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const menu = useQuery(api.menus.getByUserId);
  const sections = useQuery(
    api.sections.getByMenuId,
    menu ? { menuId: menu._id } : "skip"
  );

  const reorderSections = useMutation(api.sections.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);

  // Show dialog if business info doesn't exist
  useEffect(() => {
    if (businessInfo === null && businessInfo !== undefined) {
      setIsDialogOpen(true);
    }
  }, [businessInfo]);

  const handleSectionsDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !menu || !sections) return;

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
        menuId: menu._id,
        sectionOrders,
      });
    } catch (error) {
      console.error("Error reordering sections:", error);
    }
  };


  if (!menu && businessInfo) {
    return (
      <div className="min-h-screen bg-background">
        <RestaurantHeader
          businessName={businessInfo?.businessName || "My Restaurant"}
          logoUrl={businessInfo?.logoUrl}
          bannerUrl={businessInfo?.bannerUrl}
          googleReviewUrl={businessInfo?.googleReviewUrl}
          tripAdvisorReviewUrl={businessInfo?.tripAdvisorReviewUrl}
          socialLinks={businessInfo?.socialLinks}
          actions={<MenuHeaderActions businessName={businessInfo?.businessName} />}
        />
        <div className="container mx-auto p-6">
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
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
        actions={<MenuHeaderActions businessName={businessInfo?.businessName} />}
      />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Menu
          </h2>
          <AddSectionDialog
            open={sectionDialogOpen}
            onOpenChange={setSectionDialogOpen}
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionsDragEnd}
        >
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

      <BusinessNameDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}


export default function MenuPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AdminMenuPage />
      </Authenticated>
    </>
  );
}

