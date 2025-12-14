"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TopBar from "@/components/top-bar";
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
import { PlusSignIcon } from "@hugeicons/core-free-icons";

function AdminMenuPage() {
  const params = useParams();
  const menuName = params["menu-name"] as string;
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const menu = useQuery(api.menus.getByName, { name: menuName });
  const sections = useQuery(
    api.sections.getByMenuId,
    menu ? { menuId: menu._id } : "skip"
  );

  const createSection = useMutation(api.sections.create);
  const updateSection = useMutation(api.sections.update);
  const deleteSection = useMutation(api.sections.remove);
  const createItem = useMutation(api.menuItems.create);
  const updateItem = useMutation(api.menuItems.update);
  const deleteItem = useMutation(api.menuItems.remove);

  const [newSectionName, setNewSectionName] = useState("");
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddItem = async (sectionId: Id<"sections">, itemName: string, itemPrice: string, itemDescription: string) => {
    if (!itemName.trim()) return;
    
    setIsLoading(true);
    try {
      await createItem({
        sectionId,
        name: itemName.trim(),
        price: itemPrice.trim(),
        description: itemDescription.trim() || undefined,
      });
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async (itemId: Id<"menuItems">, newName: string, newPrice: string, newDescription: string) => {
    setIsLoading(true);
    try {
      await updateItem({
        itemId,
        name: newName.trim(),
        price: newPrice.trim(),
        description: newDescription.trim() || undefined,
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

  if (!menu) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar restaurantName="My Restaurant" />
        <div className="container mx-auto p-6">
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar restaurantName={businessInfo?.businessName || "My Restaurant"} />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            {menu.name}
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
  onAddItem: (sectionId: Id<"sections">, itemName: string, itemPrice: string, itemDescription: string) => void;
  onEditItem: (itemId: Id<"menuItems">, newName: string, newPrice: string, newDescription: string) => void;
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
            onAddItem={(id, name, price, desc) => onAddItem(id as Id<"sections">, name, price, desc)}
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
                onEdit={(newName, newPrice, newDescription) => {
                  onEditItem(item._id, newName, newPrice, newDescription);
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

export default AdminMenuPage;