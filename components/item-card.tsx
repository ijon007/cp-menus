"use client";

import { useState, useEffect } from "react";
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

interface ItemCardProps {
  itemName: string;
  itemPrice: string;
  itemDescription?: string;
  onEdit?: (newName: string, newPrice: string, newDescription: string) => void;
  onDelete?: () => void;
}

const ItemCard = ({ itemName, itemPrice, itemDescription = "", onEdit, onDelete }: ItemCardProps) => {
  const [editName, setEditName] = useState(itemName);
  const [editPrice, setEditPrice] = useState(itemPrice);
  const [editDescription, setEditDescription] = useState(itemDescription);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Reset form when dialog opens or item changes
  useEffect(() => {
    if (editOpen) {
      setEditName(itemName);
      setEditPrice(itemPrice);
      setEditDescription(itemDescription);
    }
  }, [editOpen, itemName, itemPrice, itemDescription]);

  // Format price to Albanian Lek
  const formatPrice = (price: string) => {
    // Remove any existing currency symbols and extract number
    const numPrice = price.replace(/[^0-9.]/g, "");
    if (!numPrice) return "0 Lek";
    return `${numPrice} Lek`;
  };

  const handleEdit = () => {
    if (onEdit && editName.trim()) {
      onEdit(editName, editPrice, editDescription);
      setEditOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setDeleteOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 py-2">
      <div className="flex-1">
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
            <span>Edit</span>
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
              <Button onClick={handleEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger render={<Button variant="destructive" size="sm" />}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            <span>Delete</span>
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