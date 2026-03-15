 "use client";

/* Next */
import { useState, useEffect } from "react";
import Link from "next/link";

/* Convex */
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";

/* Components */
import RestaurantHeader from "@/components/public-menu/restaurant-header";
import BusinessNameDialog from "@/components/menu/business-name-dialog";
import AddSectionDialog from "@/components/menu/add-section-dialog";
import EmptySectionsMessage from "@/components/menu/empty-sections-message";
import { CenteredFabBar } from "@/components/fab";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, SettingsIcon, LiveStreaming02Icon } from "@hugeicons/core-free-icons";

/* Utils */
import { titleToSlug } from "@/lib/utils";

/* DnD Kit */
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSection from "@/components/menu/sortable-section";

function AdminMenuPage() {
  const accessStatus = useQuery(api.userAccess.checkAccess);
  const requestAccess = useMutation(api.userAccess.requestAccess);
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const sections = useQuery(
    api.sections.getByBusinessInfoId,
    businessInfo ? { businessInfoId: businessInfo._id } : "skip"
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

  // Auto-request access if no record exists
  useEffect(() => {
    if (accessStatus && accessStatus.status === null && accessStatus.accessRecord === null) {
      requestAccess().catch(console.error);
    }
  }, [accessStatus, requestAccess]);

  // Show waiting message if access is not approved
  if (accessStatus && accessStatus.status !== "approved" && accessStatus.status !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Waiting for Approval
              </h1>
              <p className="text-muted-foreground">
                Your access request is {accessStatus.status === "pending" ? "pending" : "rejected"}. 
                Please wait for an administrator to review your request.
              </p>
            </div>
            {accessStatus.status === "rejected" && (
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact support.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  type Section = NonNullable<ReturnType<typeof useQuery<typeof api.sections.getByBusinessInfoId>>>[number];

  const handleSectionsDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !businessInfo || !sections) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const oldIndex = sections.findIndex((s: Section) => s._id === activeId);
    const newIndex = sections.findIndex((s: Section) => s._id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSections = arrayMove<Section>(sections, oldIndex, newIndex);
    const sectionOrders = newSections.map((section: Section, index) => ({
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



  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader
        businessName={businessInfo?.businessName || "My Restaurant"}
        logoUrl={businessInfo?.logoUrl}
        bannerUrl={businessInfo?.bannerUrl}
        googleReviewUrl={businessInfo?.googleReviewUrl}
        tripAdvisorReviewUrl={businessInfo?.tripAdvisorReviewUrl}
        socialLinks={businessInfo?.socialLinks}
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
          <SortableContext items={sections?.map((s: Section) => s._id) || []} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {sections && sections.length > 0 ? (
                sections.map((section: Section) => (
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

      <CenteredFabBar>
        {businessInfo?.businessName && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href={`/${titleToSlug(businessInfo.businessName)}`}
                  aria-label="View live menu"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/10 transition-colors"
                >
                  <HugeiconsIcon icon={LiveStreaming02Icon} strokeWidth={2} className="size-5" />
                </Link>
              }
            />
            <TooltipContent side="top">View live menu</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href="/waiter"
                aria-label="Waiter dashboard"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/10 transition-colors"
              >
                <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-5" />
              </Link>
            }
          />
          <TooltipContent side="top">Waiter dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href="/settings"
                aria-label="Settings"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/10 transition-colors"
              >
                <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} className="size-5" />
              </Link>
            }
          />
          <TooltipContent side="top">Settings</TooltipContent>
        </Tooltip>
      </CenteredFabBar>
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

