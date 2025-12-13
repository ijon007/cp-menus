"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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

interface Section {
  id: number;
  name: string;
  items: Item[];
}

interface Item {
  id: number;
  name: string;
  price: string;
  description?: string;
}

function AdminMenuPage() {
  const params = useParams();
  const menuName = params["menu-name"] as string;

  const [sections, setSections] = useState<Section[]>([
    { id: 1, name: "Appetizers", items: [] },
  ]);

  const [newSectionName, setNewSectionName] = useState("");
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      setSections([
        ...sections,
        { id: Date.now(), name: newSectionName, items: [] },
      ]);
      setNewSectionName("");
      setSectionDialogOpen(false);
    }
  };

  const handleAddItem = (sectionId: number, itemName: string, itemPrice: string, itemDescription: string) => {
    if (itemName.trim()) {
      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: [
                  ...section.items,
                  { id: Date.now(), name: itemName, price: itemPrice, description: itemDescription },
                ],
              }
            : section
        )
      );
    }
  };

  const handleEditItem = (sectionId: number, itemId: number, newName: string, newPrice: string, newDescription: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? { ...item, name: newName, price: newPrice, description: newDescription }
                  : item
              ),
            }
          : section
      )
    );
  };

  const handleDeleteItem = (sectionId: number, itemId: number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      )
    );
  };

  const handleEditSection = (sectionId: number, newName: string) => {
    if (newName.trim()) {
      setSections(
        sections.map((section) =>
          section.id === sectionId ? { ...section, name: newName } : section
        )
      );
    }
  };

  const handleDeleteSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar restaurantName="My Restaurant" />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            {menuName}
          </h2>
          <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
            <DialogTrigger render={<Button variant="default" />}>
              Add Section
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
                  onClick={() => {
                    handleAddSection();
                  }}
                >
                  Add Section
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-base">{section.name}</CardTitle>
                  <SectionActions
                    sectionId={section.id}
                    sectionName={section.name}
                    onEdit={handleEditSection}
                    onDelete={handleDeleteSection}
                    onAddItem={handleAddItem}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {section.items.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No items yet. Click "Add Item" to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <ItemCard
                        key={item.id}
                        itemName={item.name}
                        itemPrice={item.price}
                        itemDescription={item.description}
                        onEdit={(newName, newPrice, newDescription) => {
                          handleEditItem(section.id, item.id, newName, newPrice, newDescription);
                        }}
                        onDelete={() => {
                          handleDeleteItem(section.id, item.id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMenuPage;