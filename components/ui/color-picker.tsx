"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string | null;
  onChange: (color: string | null) => void;
  disabled?: boolean;
  id?: string;
}

export function ColorPicker({ value, onChange, disabled, id }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [localColor, setLocalColor] = React.useState(value || "#000000");

  // Sync with prop value only when popover is closed
  // This prevents feedback loops when user is actively picking a color
  React.useEffect(() => {
    if (!open) {
      const newColor = value || "#000000";
      setLocalColor((prev) => {
        // Only update if actually different to prevent unnecessary re-renders
        if (prev === newColor) return prev;
        return newColor;
      });
    }
  }, [value, open]);

  // Initialize localColor when popover opens - capture current value
  const initialValueRef = React.useRef(value);
  React.useEffect(() => {
    if (open) {
      // Capture the value when opening, so we don't react to value changes while open
      initialValueRef.current = value;
      const newColor = value || "#000000";
      setLocalColor(newColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Only depend on open, not value, to avoid loops when value changes during interaction

  const handleColorChange = React.useCallback((color: string) => {
    setLocalColor(color);
    onChange(color);
  }, [onChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text === "") {
      onChange(null);
      setLocalColor("#000000");
    } else if (/^#[0-9A-Fa-f]{0,6}$/.test(text)) {
      setLocalColor(text);
      if (text.length === 7) {
        onChange(text);
      }
    }
  };

  const displayColor = value || "#000000";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "w-full justify-start text-left font-normal",
          "bg-input/20 dark:bg-input/30 border-input hover:bg-input/30 dark:hover:bg-input/40",
          "border rounded-md px-1 py-1 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          !value && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        <div className="flex items-center gap-2 w-full">
          <div
            className="h-5 w-5 rounded border border-border shrink-0"
            style={{ backgroundColor: displayColor }}
          />
          <span className="flex-1 text-left text-foreground">
            {value || "No color"}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-3">
          <HexColorPicker color={localColor} onChange={handleColorChange} />
          <Input
            type="text"
            value={localColor}
            onChange={handleTextChange}
            placeholder="#000000"
            className="font-mono text-sm"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}


