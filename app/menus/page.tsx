"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TopBar from "@/components/top-bar";
import MenuCard from "@/components/menu-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

function AdminPage() {
  const router = useRouter();
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const menus = useQuery(api.menus.getByUserId);
  const createBusinessInfo = useMutation(api.businessInfo.create);
  const createMenu = useMutation(api.menus.create);
  const updateMenu = useMutation(api.menus.update);
  const deleteMenu = useMutation(api.menus.remove);
  
  const [businessName, setBusinessName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Menu dialogs
  const [createMenuDialogOpen, setCreateMenuDialogOpen] = useState(false);
  const [editMenuDialogOpen, setEditMenuDialogOpen] = useState(false);
  const [deleteMenuDialogOpen, setDeleteMenuDialogOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [editingMenu, setEditingMenu] = useState<{ id: Id<"menus">; name: string } | null>(null);
  const [deletingMenu, setDeletingMenu] = useState<{ id: Id<"menus">; name: string } | null>(null);
  const [isMenuLoading, setIsMenuLoading] = useState(false);

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

  const handleCreateMenu = async () => {
    if (!newMenuName.trim()) return;
    
    setIsMenuLoading(true);
    try {
      const menuId = await createMenu({ name: newMenuName.trim() });
      setNewMenuName("");
      setCreateMenuDialogOpen(false);
      router.push(`/menus/${newMenuName.trim()}`);
    } catch (error) {
      console.error("Error creating menu:", error);
    } finally {
      setIsMenuLoading(false);
    }
  };

  const handleEditMenu = async () => {
    if (!editingMenu || !newMenuName.trim()) return;
    
    setIsMenuLoading(true);
    try {
      await updateMenu({ menuId: editingMenu.id, name: newMenuName.trim() });
      setNewMenuName("");
      setEditingMenu(null);
      setEditMenuDialogOpen(false);
    } catch (error) {
      console.error("Error updating menu:", error);
    } finally {
      setIsMenuLoading(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (!deletingMenu) return;
    
    setIsMenuLoading(true);
    try {
      await deleteMenu({ menuId: deletingMenu.id });
      setDeletingMenu(null);
      setDeleteMenuDialogOpen(false);
    } catch (error) {
      console.error("Error deleting menu:", error);
    } finally {
      setIsMenuLoading(false);
    }
  };

  const openEditDialog = (menu: { _id: Id<"menus">; name: string }) => {
    setEditingMenu({ id: menu._id, name: menu.name });
    setNewMenuName(menu.name);
    setEditMenuDialogOpen(true);
  };

  const openDeleteDialog = (menu: { _id: Id<"menus">; name: string }) => {
    setDeletingMenu({ id: menu._id, name: menu.name });
    setDeleteMenuDialogOpen(true);
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
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Menu List</h3>
              <Dialog open={createMenuDialogOpen} onOpenChange={setCreateMenuDialogOpen}>
                <DialogTrigger render={<Button variant="default" />}>
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                  <span>Add Menu</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Menu</DialogTitle>
                    <DialogDescription>
                      Add a new menu to your restaurant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="menu-name">Menu Name</Label>
                      <Input
                        id="menu-name"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                        placeholder="e.g., Breakfast Menu"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newMenuName.trim()) {
                            handleCreateMenu();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNewMenuName("");
                        setCreateMenuDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateMenu}
                      disabled={!newMenuName.trim() || isMenuLoading}
                    >
                      {isMenuLoading ? "Creating..." : "Create Menu"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menus && menus.length > 0 ? (
                menus.map((menu) => (
                  <MenuCard
                    key={menu._id}
                    menuName={menu.name}
                    onEdit={() => openEditDialog(menu)}
                    onDelete={() => openDeleteDialog(menu)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No menus yet. Create your first menu to get started.
                </p>
              )}
            </div>
          </div>

          <Dialog open={editMenuDialogOpen} onOpenChange={setEditMenuDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Menu</DialogTitle>
                <DialogDescription>
                  Update the menu name
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-menu-name">Menu Name</Label>
                  <Input
                    id="edit-menu-name"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    placeholder="e.g., Breakfast Menu"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newMenuName.trim()) {
                        handleEditMenu();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewMenuName("");
                    setEditingMenu(null);
                    setEditMenuDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditMenu}
                  disabled={!newMenuName.trim() || isMenuLoading}
                >
                  {isMenuLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteMenuDialogOpen} onOpenChange={setDeleteMenuDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{deletingMenu?.name}" and all its sections and items. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingMenu(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMenu}
                  className="bg-destructive text-white hover:bg-destructive/90"
                  disabled={isMenuLoading}
                >
                  {isMenuLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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