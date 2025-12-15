"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import RestaurantHeader from "@/components/public-menu/restaurant-header";
import ItemCard from "@/components/item-card";
import SectionActions from "@/components/section-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, EyeIcon, SettingsIcon, Logout05Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { titleToSlug } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AdminMenuPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const menu = useQuery(api.menus.getByUserId);
  const sections = useQuery(
    api.sections.getByMenuId,
    menu ? { menuId: menu._id } : "skip"
  );

  const createBusinessInfo = useMutation(api.businessInfo.create);
  const createSection = useMutation(api.sections.create);
  const updateSection = useMutation(api.sections.update);
  const deleteSection = useMutation(api.sections.remove);
  const createItem = useMutation(api.menuItems.create);
  const updateItem = useMutation(api.menuItems.update);
  const deleteItem = useMutation(api.menuItems.remove);

  const [businessName, setBusinessName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Show dialog if business info doesn't exist
  useEffect(() => {
    if (businessInfo === null && businessInfo !== undefined) {
      setIsDialogOpen(true);
    }
  }, [businessInfo]);

  const handleSaveBusinessName = async () => {
    if (!businessName.trim()) return;
    
    setIsLoading(true);
    try {
      await createBusinessInfo({ businessName: businessName.trim() });
      setIsDialogOpen(false);
      setBusinessName("");
    } catch (error) {
      console.error("Error saving business name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewLiveMenu = () => {
    if (businessInfo?.businessName) {
      const slug = titleToSlug(businessInfo.businessName);
      router.push(`/${slug}`);
    }
  };

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    await signOut();
    router.push("/");
  };

  const handleAddSection = async () => {
    if (!menu || !newSectionName.trim()) return;
    
    setIsLoading(true);
    try {
      await createSection({ menuId: menu._id, name: newSectionName.trim() });
      setNewSectionName("");
      setSectionDialogOpen(false);
    } catch (error) {
      console.error("Error creating section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (sectionId: Id<"sections">, itemName: string, itemPrice: string, itemDescription: string, storageId?: string) => {
    if (!itemName.trim()) return;
    
    setIsLoading(true);
    try {
      await createItem({
        sectionId,
        name: itemName.trim(),
        price: itemPrice.trim(),
        description: itemDescription.trim() || undefined,
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
      await updateItem({
        itemId,
        name: newName.trim(),
        price: newPrice.trim(),
        description: newDescription.trim() || undefined,
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

  const handleEditSection = async (sectionId: Id<"sections">, newName: string) => {
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

  const handleDeleteSection = async (sectionId: Id<"sections">) => {
    setIsLoading(true);
    try {
      await deleteSection({ sectionId });
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const headerActions = (
    <>
      {/* Desktop buttons - hidden on mobile */}
      <div className="hidden md:flex items-center gap-2">
        {businessInfo?.businessName && (
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg"
            onClick={handleViewLiveMenu}
          >
            <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
            <span>View Live</span>
          </Button>
        )}
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg"
          onClick={() => router.push("/settings")}
        >
          <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
          <span>Settings</span>
        </Button>
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogTrigger render={<Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg"
          />}>
            <HugeiconsIcon icon={Logout05Icon} strokeWidth={2} />
            <span>Log Out</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out? You will need to sign in again to access your menu.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile menu - visible only on mobile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg"
          />}>
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            {businessInfo?.businessName && (
              <DropdownMenuItem onClick={handleViewLiveMenu}>
                <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
                <span>View Live</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
              <HugeiconsIcon icon={Logout05Icon} strokeWidth={2} />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout confirmation dialog - shared between mobile and desktop */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your menu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

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
          actions={headerActions}
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
        actions={headerActions}
      />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Menu
          </h2>
          <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
            <DialogTrigger render={<Button variant="default" />}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              <span>Add Section</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>
                  Create a new section for your menu
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="section-name">Section Name</Label>
                  <Input
                    id="section-name"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="e.g., Main Courses"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSectionName.trim()) {
                        handleAddSection();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewSectionName("");
                    setSectionDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSection}
                  disabled={!newSectionName.trim() || isLoading}
                >
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                  <span>{isLoading ? "Adding..." : "Add Section"}</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <SectionWithItems
                key={section._id}
                section={section}
                onEdit={handleEditSection}
                onDelete={handleDeleteSection}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            ))
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  No sections yet. Click "Add Section" to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Welcome! Let's get started</DialogTitle>
            <DialogDescription>
              Please enter your business name to continue. This will be used to identify your restaurant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Joe's Restaurant"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && businessName.trim()) {
                    handleSaveBusinessName();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveBusinessName}
              disabled={!businessName.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionWithItems({
  section,
  onEdit,
  onDelete,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: {
  section: { _id: Id<"sections">; name: string };
  onEdit: (sectionId: Id<"sections">, newName: string) => void;
  onDelete: (sectionId: Id<"sections">) => void;
  onAddItem: (sectionId: Id<"sections">, itemName: string, itemPrice: string, itemDescription: string, storageId?: string) => void;
  onEditItem: (itemId: Id<"menuItems">, newName: string, newPrice: string, newDescription: string, storageId?: string) => void;
  onDeleteItem: (itemId: Id<"menuItems">) => void;
}) {
  const items = useQuery(api.menuItems.getBySectionId, { sectionId: section._id });

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-base">{section.name}</CardTitle>
          <SectionActions
            sectionId={section._id}
            sectionName={section.name}
            onEdit={(id, name) => onEdit(id as Id<"sections">, name)}
            onDelete={(id) => onDelete(id as Id<"sections">)}
            onAddItem={(id, name, price, desc, storageId) => onAddItem(id as Id<"sections">, name, price, desc, storageId)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {items && items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                itemName={item.name}
                itemPrice={item.price}
                itemDescription={item.description}
                itemImage={item.imageUrl || "/coffee-cup.webp"}
                onEdit={(newName, newPrice, newDescription, storageId) => {
                  onEditItem(item._id, newName, newPrice, newDescription, storageId);
                }}
                onDelete={() => {
                  onDeleteItem(item._id);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No items yet. Click "Add Item" to get started.
          </p>
        )}
      </CardContent>
    </Card>
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

