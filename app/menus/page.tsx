"use client";

import TopBar from "@/components/top-bar";
import MenuCard from "@/components/menu-card";
import { useRouter } from "next/navigation";
function AdminPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-background">
      <TopBar restaurantName="My Restaurant" />
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
    </div>
  );
}

export default AdminPage;