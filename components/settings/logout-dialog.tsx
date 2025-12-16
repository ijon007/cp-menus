"use client";

/* Next */
import { useRouter } from "next/navigation";

/* Clerk */
import { useClerk } from "@clerk/nextjs";

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

/* Icons */
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout05Icon } from "@hugeicons/core-free-icons";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    onOpenChange(false);
    await signOut();
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}>
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
            onClick={() => onOpenChange(false)}
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
  );
}

