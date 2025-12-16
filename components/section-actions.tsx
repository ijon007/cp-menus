"use client";

/* Next */
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* Convex */
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/* Components */
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Delete02Icon, Edit02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";

interface SectionActionsProps {
  sectionId: string | number;
  sectionName: string;
  onEdit: (sectionId: string | number, newName: string) => void;
  onDelete: (sectionId: string | number) => void;
  onAddItem: (sectionId: string | number, itemName: string, itemPrice: string, itemDescription: string, storageId?: string) => void;
}

export default function SectionActions({
  sectionId,
  sectionName,
  onEdit,
  onDelete,
  onAddItem,
}: SectionActionsProps) {
  const generateUploadUrl = useMutation(api.menuItems.generateUploadUrl);
  const [editSectionName, setEditSectionName] = useState(sectionName);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  // Reset edit form when dialog opens
  useEffect(() => {
    if (editDialogOpen) {
      setEditSectionName(sectionName);
    }
  }, [editDialogOpen, sectionName]);

  // Reset add item form when dialog opens/closes
  useEffect(() => {
    if (!addItemDialogOpen) {
      setNewItemName("");
      setNewItemPrice("");
      setNewItemDescription("");
      setSelectedImage(null);
      setImagePreview(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [addItemDialogOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    if (editSectionName.trim()) {
      onEdit(sectionId, editSectionName);
      setEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete(sectionId);
    setDeleteDialogOpen(false);
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    setIsUploading(true);
    try {
      let storageId: string | undefined;

      // Step 1: Upload image if selected
      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId: uploadedStorageId } = await result.json();
        storageId = uploadedStorageId;
      }

      // Step 2: Save item with storage ID
      onAddItem(sectionId, newItemName, newItemPrice, newItemDescription, storageId);
      setAddItemDialogOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>Update the section name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-section-name-${sectionId}`}>Section Name</Label>
              <Input
                id={`edit-section-name-${sectionId}`}
                value={editSectionName}
                onChange={(e) => setEditSectionName(e.target.value)}
                placeholder="e.g., Main Courses"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditSectionName(sectionName);
                setEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger render={<Button variant="destructive" size="sm" />}>
         <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{sectionName}"? This will also delete all items in this section. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span>Cancel</span>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Add Item
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add an item to {sectionName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor={`item-name-${sectionId}`}>Item Name</Label>
              <Input
                id={`item-name-${sectionId}`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Caesar Salad"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`item-price-${sectionId}`}>Price (Lek)</Label>
              <Input
                id={`item-price-${sectionId}`}
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="e.g., 1200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`item-description-${sectionId}`}>Description</Label>
              <Textarea
                id={`item-description-${sectionId}`}
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="e.g., Fresh romaine lettuce with Caesar dressing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`item-image-${sectionId}`}>Image</Label>
              <Input
                id={`item-image-${sectionId}`}
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewItemName("");
                setNewItemPrice("");
                setNewItemDescription("");
                setAddItemDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={isUploading}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              {isUploading ? "Uploading..." : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

