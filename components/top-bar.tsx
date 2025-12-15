"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SettingsIcon } from "@hugeicons/core-free-icons";

interface TopBarProps {
  restaurantName: string;
}

export default function TopBar({ restaurantName }: TopBarProps) {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
      <h1 className="text-xl font-semibold text-foreground">{restaurantName}</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="hover:bg-accent">
          <Link href="/settings" className="flex items-center gap-1">
            <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
            <span>Settings</span>
          </Link>
        </Button>
        <Button variant="outline" onClick={handleLogout} className="border-border hover:bg-accent">
          Log Out
        </Button>
      </div>
    </div>
  );
}

