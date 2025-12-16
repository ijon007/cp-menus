"use client";

/* Next */
import { useState } from "react";

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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Constants */
import { PLACEHOLDERS } from "@/constants/placeholders";

interface BusinessNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BusinessNameDialog({
  open,
  onOpenChange,
}: BusinessNameDialogProps) {
  const createBusinessInfo = useMutation(api.businessInfo.create);
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!businessName.trim()) return;
    
    setIsLoading(true);
    try {
      await createBusinessInfo({ businessName: businessName.trim() });
      onOpenChange(false);
      setBusinessName("");
    } catch (error) {
      console.error("Error saving business name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              placeholder={PLACEHOLDERS.BUSINESS_NAME}
              onKeyDown={(e) => {
                if (e.key === "Enter" && businessName.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!businessName.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

