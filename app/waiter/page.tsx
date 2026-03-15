"use client";

import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { WaiterDashboard } from "@/components/waiter/waiter-dashboard";
import { CenteredFabBar } from "@/components/fab";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, SettingsIcon } from "@hugeicons/core-free-icons";

export default function WaiterPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
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
      </Authenticated>
    </>
  );
}
