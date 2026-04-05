"use client";

import * as React from "react";
import Image from "next/image";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatPrice } from "@/utils/formatting";

export type MenuItemPreviewPayload = {
  name: string;
  price: string;
  description?: string;
  image: string;
};

type PreviewInteractionProps = {
  role: "button";
  tabIndex: number;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
};

type PreviewContextValue = {
  openPreview: (payload: MenuItemPreviewPayload) => void;
  previewProps: (payload: MenuItemPreviewPayload) => PreviewInteractionProps;
};

const PreviewContext = React.createContext<PreviewContextValue | null>(null);

function MenuItemDetailDrawer({
  item,
  open,
  onOpenChange,
}: {
  item: MenuItemPreviewPayload | null;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background">
        {item ? (
          <DrawerHeader className="flex flex-col items-start justify-center text-left">
            <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-lg bg-muted">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 32rem"
              />
            </div>
            <DrawerTitle className="text-lg font-semibold">
              {item.name}
            </DrawerTitle>
            {item.description ? (
              <DrawerDescription className="text-sm">
                {item.description}
              </DrawerDescription>
            ) : null}
            <p className="text-foreground text-sm font-medium">
              {formatPrice(item.price)}
            </p>
          </DrawerHeader>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export function MenuItemPreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState<MenuItemPreviewPayload | null>(null);

  const openPreview = React.useCallback((payload: MenuItemPreviewPayload) => {
    setItem(payload);
    setOpen(true);
  }, []);

  const previewProps = React.useCallback(
    (payload: MenuItemPreviewPayload) => ({
      role: "button" as const,
      tabIndex: 0,
      onClick: () => {
        openPreview(payload);
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPreview(payload);
        }
      },
    }),
    [openPreview]
  );

  const value = React.useMemo(
    () => ({ openPreview, previewProps }),
    [openPreview, previewProps]
  );

  return (
    <PreviewContext.Provider value={value}>
      {children}
      <MenuItemDetailDrawer
        item={item}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setItem(null);
          }
        }}
      />
    </PreviewContext.Provider>
  );
}

export function useMenuItemPreview(): PreviewContextValue {
  const ctx = React.useContext(PreviewContext);
  if (!ctx) {
    throw new Error(
      "useMenuItemPreview must be used within MenuItemPreviewProvider"
    );
  }
  return ctx;
}

