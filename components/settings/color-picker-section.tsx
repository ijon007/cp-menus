"use client";

/* Components */
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

interface ColorPickerSectionProps {
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  backgroundColor: string | null;
  onPrimaryColorChange: (color: string | null) => void;
  onSecondaryColorChange: (color: string | null) => void;
  onAccentColorChange: (color: string | null) => void;
  onBackgroundColorChange: (color: string | null) => void;
  disabled?: boolean;
}

export default function ColorPickerSection({
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onAccentColorChange,
  onBackgroundColorChange,
  disabled = false,
}: ColorPickerSectionProps) {
  const handleClearColor = (onChange: (color: string | null) => void) => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Brand Colors</h3>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Primary Color */}
        <div className="space-y-2 flex-1">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2 w-full">
            <ColorPicker
              id="primary-color"
              value={primaryColor}
              onChange={onPrimaryColorChange}
              disabled={disabled}
            />
            {primaryColor && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleClearColor(onPrimaryColorChange)}
                disabled={disabled}
                className="shrink-0 border border-destructive/30 size-8"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {/* Secondary Color */}
        <div className="space-y-2 flex-1">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex gap-2 w-full">
            <ColorPicker
              id="secondary-color"
              value={secondaryColor}
              onChange={onSecondaryColorChange}
              disabled={disabled}
            />
            {secondaryColor && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleClearColor(onSecondaryColorChange)}
                disabled={disabled}
                className="shrink-0 size-8 border border-destructive/30"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-2 flex-1">
          <Label htmlFor="accent-color">Accent Color</Label>
          <div className="flex gap-2 w-full">
            <ColorPicker
              id="accent-color"
              value={accentColor}
              onChange={onAccentColorChange}
              disabled={disabled}
            />
            {accentColor && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleClearColor(onAccentColorChange)}
                disabled={disabled}
                className="shrink-0 size-8 border border-destructive/30"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2 flex-1">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex gap-2 w-full">
            <ColorPicker
              id="background-color"
              value={backgroundColor}
              onChange={onBackgroundColorChange}
              disabled={disabled}
            />
            {backgroundColor && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleClearColor(onBackgroundColorChange)}
                disabled={disabled}
                className="shrink-0 size-8 border border-destructive/30"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

