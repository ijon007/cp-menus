"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  restaurantName: string;
}

export default function TopBar({ restaurantName }: TopBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
      <h1 className="text-xl font-semibold text-foreground">{restaurantName}</h1>
      <Button variant="outline" onClick={handleLogout} className="border-border hover:bg-accent">
        Log Out
      </Button>
    </div>
  );
}

