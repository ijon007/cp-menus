"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Language, MenuTranslations } from "@/app/menu/i18n";

interface LanguageFABProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: MenuTranslations;
}

export function LanguageFAB({ language, setLanguage, t }: LanguageFABProps) {
  return (
    <DropdownMenu>
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
  );
}

interface CallWaiterFABProps {
  restaurantSlug: string;
  tableNumber: number | null;
  /** Rendered next to the call-waiter button in the same FAB group (e.g. language selector). */
  extraButtons?: React.ReactNode;
}

export function CallWaiterFAB({
  restaurantSlug,
  tableNumber,
  extraButtons,
}: CallWaiterFABProps) {
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const callWaiter = useMutation(api.waiterCalls.callWaiter);

  useEffect(() => {
    if (cooldownUntil == null) return;
    const remaining = cooldownUntil - Date.now();
    if (remaining <= 0) {
      setCooldownUntil(null);
      return;
    }
    const t = setTimeout(() => setCooldownUntil(null), remaining);
    return () => clearTimeout(t);
  }, [cooldownUntil]);

  const handleCall = async () => {
    if (!tableNumber || calling || called || cooldownUntil != null) return;

    setCalling(true);
    try {
      await callWaiter({ slug: restaurantSlug, tableNumber });
      setCalled(true);
      setCooldownUntil(Date.now() + 3000);
      toast.success(`Waiter called for Table ${tableNumber}`);
      setTimeout(() => setCalled(false), 30000);
    } catch {
      toast.error("Could not call waiter. Please try again.");
    } finally {
      setCalling(false);
    }
  };

  const inCooldown = cooldownUntil != null && Date.now() < cooldownUntil;
  const disabled = !tableNumber || calling || called || inCooldown;

  return (
    <div
      className="fixed -bottom-1 left-0 right-0 z-50 flex justify-end px-3 pb-3 pt-2"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-row items-center justify-center gap-0.5 rounded-full bg-secondary/95 px-2 py-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
        {extraButtons}
        <Button
          variant="ghost"
          size="icon"
          className={`size-9 rounded-full text-foreground hover:bg-black/10 transition-opacity ${inCooldown ? "opacity-60 cursor-wait" : ""}`}
          onClick={handleCall}
          disabled={disabled}
          aria-label={
            inCooldown
              ? "Please wait before calling again"
              : tableNumber
                ? called
                  ? `Waiter called for Table ${tableNumber}`
                  : `Call waiter for Table ${tableNumber}`
                : "Open from your table's QR code to call the waiter"
          }
          title={
            inCooldown
              ? "Please wait a moment before calling again"
              : tableNumber
                ? called
                  ? `Waiter already called for Table ${tableNumber}`
                  : `Call waiter for Table ${tableNumber}`
                : "Scan your table's QR code to call the waiter"
          }
        >
          <HugeiconsIcon
            icon={Notification01Icon}
            strokeWidth={2}
            className="size-5"
          />
        </Button>
      </div>
    </div>
  );
}
