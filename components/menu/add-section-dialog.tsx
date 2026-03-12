"use client";

/* Next */
import { useState } from "react";

/* Convex */
import { useQuery, useMutation, useAction } from "convex/react";
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

/* Constants */
import { PLACEHOLDERS } from "@/constants/placeholders";

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddSectionDialog({
  open,
  onOpenChange,
}: AddSectionDialogProps) {
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const createSection = useMutation(api.sections.create);
  const translateToAllLanguages = useAction(api.translate.translateToAllLanguages);
  const [sectionName, setSectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!businessInfo || !sectionName.trim()) return;

    setIsLoading(true);
    try {
      const nameTranslations = await translateToAllLanguages({
        text: sectionName.trim(),
        sourceLanguage: "en",
      });
      await createSection({
        businessInfoId: businessInfo._id,
        name: sectionName.trim(),
        nameTranslations,
      });
      setSectionName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="default" size="sm" className="py-3" />}>
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
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder={PLACEHOLDERS.SECTION_NAME}
              onKeyDown={(e) => {
                if (e.key === "Enter" && sectionName.trim()) {
                  handleAdd();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSectionName("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!sectionName.trim() || isLoading}
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            <span>{isLoading ? "Adding..." : "Add Section"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

