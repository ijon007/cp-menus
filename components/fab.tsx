"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Language, MenuTranslations } from "@/app/menu/i18n";

interface LanguageFABProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: MenuTranslations;
}

export function LanguageFAB({ language, setLanguage, t }: LanguageFABProps) {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              aria-label={t.languageSelectorLabel}
              className="size-9 shrink-0 cursor-pointer select-none inline-flex items-center justify-center rounded-full text-foreground hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 transition-colors outline-none"
            >
              <span
                aria-hidden="true"
                className={`fi fis size-5 shrink-0 ${
                  language === "en" ? "fi-gb" : language === "sq" ? "fi-al" : "fi-it"
                }`}
              />
            </DropdownMenuTrigger>
          }
        />
        <TooltipContent side="top">{t.languageSelectorLabel}</TooltipContent>
      <DropdownMenuContent align="end" side="top" sideOffset={8} className="min-w-32">
        <DropdownMenuItem onClick={() => setLanguage("en")} aria-label={t.languageEnglish}>
          <span aria-hidden="true" className="fi fi-gb fis mr-2" />
          <span>{t.languageEnglish}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("sq")} aria-label={t.languageAlbanian}>
          <span aria-hidden="true" className="fi fi-al fis mr-2" />
          <span>{t.languageAlbanian}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("it")} aria-label={t.languageItalian}>
          <span aria-hidden="true" className="fi fi-it fis mr-2" />
          <span>{t.languageItalian}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}

/** Same pill-style FAB bar, centered at bottom. Use for menu/waiter/settings pages. */
export function CenteredFabBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed -bottom-1 left-0 right-0 z-50 flex justify-center px-2 pb-2 pt-1.5"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-row items-center justify-center gap-0.5 rounded-full bg-secondary/95 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

interface CallWaiterFABProps {
  restaurantSlug: string;
  tableNumber: number | null;
  sessionId: string | null;
  /** Rendered next to the call-waiter button in the same FAB group (e.g. language selector). */
  extraButtons?: React.ReactNode;
  /** Horizontal alignment of the FAB bar. Default "right" (LiveMenu style); use "center" for menu/restaurant pages. */
  align?: "center" | "right";
  /** When provided (e.g. from public menu), tooltip and aria-label use these translations. */
  translations?: MenuTranslations;
  /** When true, show the tooltip briefly on initial mount (e.g. on public menu load). */
  showTooltipOnMount?: boolean;
}

export function CallWaiterFAB({
  restaurantSlug,
  tableNumber,
  sessionId,
  extraButtons,
  align = "right",
  translations: t,
  showTooltipOnMount = false,
}: CallWaiterFABProps) {
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const inFlightRef = useRef(false);
  const [tooltipOpen, setTooltipOpen] = useState(showTooltipOnMount);
  const callWaiter = useMutation(api.waiterCalls.callWaiter);

  useEffect(() => {
    if (!showTooltipOnMount || !tooltipOpen) return;

    const timeoutId = setTimeout(() => {
      setTooltipOpen(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [showTooltipOnMount, tooltipOpen]);

  const handleCall = async () => {
    if (!tableNumber || !sessionId || inFlightRef.current) return;

    inFlightRef.current = true;
    setCalling(true);
    try {
      const result = await callWaiter({
        slug: restaurantSlug,
        tableNumber,
        sessionId,
      });
      if (result && result.limitReached) {
        toast.error(
          "You've reached the waiter call limit for this visit. Please rescan your table QR to call again."
        );
      } else {
        setCalled(true);
        toast.success(`Waiter called for Table ${tableNumber}`);
      }
    } catch {
      toast.error("Could not call waiter. Please try again.");
    } finally {
      setCalling(false);
      inFlightRef.current = false;
    }
  };

  const disabled = !tableNumber || calling;
  const callWaiterTooltip = t
    ? tableNumber
      ? called
        ? t.callWaiterTooltipCalled.replace("{table}", String(tableNumber))
        : t.callWaiterTooltip.replace("{table}", String(tableNumber))
      : t.callWaiterTooltipNoTable
    : tableNumber
      ? called
        ? `Waiter already called for Table ${tableNumber}`
        : `Call waiter for Table ${tableNumber}`
      : "Scan your table's QR code to call the waiter";
  const ariaLabel = t
    ? callWaiterTooltip
    : tableNumber
      ? called
        ? `Waiter called for Table ${tableNumber}`
        : `Call waiter for Table ${tableNumber}`
      : "Open from your table's QR code to call the waiter";

  return (
    <div
      className={`fixed -bottom-1 left-0 right-0 z-50 flex px-3 pb-3 pt-2 ${align === "center" ? "justify-center" : "justify-end"}`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-row items-center justify-center gap-0.5 rounded-full bg-secondary/95 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
        {extraButtons}
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-foreground hover:bg-black/10 transition-opacity"
                onClick={handleCall}
                disabled={disabled}
                aria-label={ariaLabel}
              >
                <HugeiconsIcon
                  icon={Notification01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
              </Button>
            }
          />
          <TooltipContent side="top">{callWaiterTooltip}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
