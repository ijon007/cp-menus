"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TopBar from "@/components/top-bar";
import MenuCard from "@/components/menu-card";
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
import { Button } from "@/components/ui/button";

function AdminPage() {
  const router = useRouter();
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const createBusinessInfo = useMutation(api.businessInfo.create);
  
  const [businessName, setBusinessName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Sample menu data - replace with actual data fetching
  const menus = [
    { id: 1, name: "Breakfast Menu" },
    { id: 2, name: "Lunch Menu" },
    { id: 3, name: "Dinner Menu" },
  ];

  const handleEdit = (menuId: number) => {
    router.push(`/menus/${menuId}`);
  };

  const handleDelete = (menuId: number) => {
    console.log("Delete menu:", menuId);
    // Add delete logic here
  };

  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="min-h-screen bg-background">
          <TopBar restaurantName={businessInfo?.businessName || "My Restaurant"} />
          <div className="container mx-auto p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Menu List</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menuName={menu.name}
                  onEdit={() => handleEdit(menu.id)}
                  onDelete={() => handleDelete(menu.id)}
                />
              ))}
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
      </Authenticated>
    </>
  );
}

export default AdminPage;