"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Delete02Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

interface ItemCardProps {
  itemName: string;
  itemPrice: string;
  itemDescription?: string;
  itemImage?: string;
  onEdit?: (newName: string, newPrice: string, newDescription: string, storageId?: string) => void;
  onDelete?: () => void;
}

const ItemCard = ({ itemName, itemPrice, itemDescription = "", itemImage = "/coffee-cup.webp", onEdit, onDelete }: ItemCardProps) => {
  const generateUploadUrl = useMutation(api.menuItems.generateUploadUrl);
  const [editName, setEditName] = useState(itemName);
  const [editPrice, setEditPrice] = useState(itemPrice);
  const [editDescription, setEditDescription] = useState(itemDescription);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Reset form when dialog opens or item changes
  useEffect(() => {
    if (editOpen) {
      setEditName(itemName);
      setEditPrice(itemPrice);
      setEditDescription(itemDescription);
      setSelectedImage(null);
      setImagePreview(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [editOpen, itemName, itemPrice, itemDescription]);

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

  // Format price to Albanian Lek
  const formatPrice = (price: string) => {
    // Remove any existing currency symbols and extract number
    const numPrice = price.replace(/[^0-9.]/g, "");
    if (!numPrice) return "0 Lek";
    return `${numPrice} Lek`;
  };

  const handleEdit = async () => {
    if (!onEdit || !editName.trim()) return;

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
      onEdit(editName, editPrice, editDescription, storageId);
      setEditOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setDeleteOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 py-2 gap-4">
      <div className="w-16 h-16 shrink-0 relative overflow-hidden rounded-md">
        <Image
          src={itemImage}
          alt={itemName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-semibold text-sm">{itemName}</p>
        {itemDescription && (
          <p className="text-muted-foreground text-sm font-normal">{itemDescription}</p>
        )}
        <p className="text-muted-foreground text-sm font-semibold">{formatPrice(itemPrice)}</p>
      </div>
      <div className="flex gap-2">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update the item name and price
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-name">Item Name</Label>
                <Input
                  id="edit-item-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g., Caesar Salad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-price">Price (Lek)</Label>
                <Input
                  id="edit-item-price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="e.g., 1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-description">Description</Label>
                <Textarea
                  id="edit-item-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g., Fresh romaine lettuce with Caesar dressing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-image">Image</Label>
                {itemImage && itemImage !== "/coffee-cup.webp" && !imagePreview && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Current image:</p>
                    <Image
                      src={itemImage}
                      alt="Current"
                      width={128}
                      height={128}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <Input
                  id="edit-item-image"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">New image preview:</p>
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
                  setEditName(itemName);
                  setEditPrice(itemPrice);
                  setEditDescription(itemDescription);
                  setEditOpen(false);
                }}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger render={<Button variant="destructive" size="sm" />}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{itemName}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ItemCard;