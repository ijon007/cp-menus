"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WaiterDashboard } from "@/components/waiter/waiter-dashboard";
import { CenteredFabBar } from "@/components/fab";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, SettingsIcon } from "@hugeicons/core-free-icons";

function WaiterPageContent() {
  const router = useRouter();
  const businessInfo = useQuery(api.businessInfo.getByUserId);

  if (businessInfo === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (businessInfo !== null && businessInfo.waiterEnabled === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Waiter not available</h1>
          <p className="text-muted-foreground">
            Your account is on menu-only mode. Contact support if you need waiter tools enabled.
          </p>
          <Button type="button" onClick={() => router.push("/menu")}>
            Back to menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <WaiterDashboard />
      <CenteredFabBar>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/menu"
                  aria-label="Menu"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/10 transition-colors"
                >
                  <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-5" />
                </Link>
              }
            />
            <TooltipContent side="top">Menu</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/settings"
                  aria-label="Settings"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/10 transition-colors"
                >
                  <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} className="size-5" />
                </Link>
              }
            />
            <TooltipContent side="top">Settings</TooltipContent>
          </Tooltip>
        </CenteredFabBar>
    </>
  );
}

export default function WaiterPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <WaiterPageContent />
      </Authenticated>
    </>
  );
}
