"use client";

/* Next */
import { forwardRef } from "react";
import Image from "next/image";

/* Components */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  id: string;
  label: string;
  currentPreview: string | null;
  selectedFile: File | null;
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  aspectRatio?: "square" | "wide";
}

const ImageUploadField = forwardRef<HTMLInputElement | null, ImageUploadFieldProps>(({
  id,
  label,
  currentPreview,
  selectedFile,
  preview,
  onFileChange,
  disabled = false,
  aspectRatio = "square",
}, ref) => {

  const containerClass = aspectRatio === "square" 
    ? "relative w-32 h-32 border border-border rounded-lg overflow-hidden bg-background"
    : "relative w-full h-48 border border-border rounded-lg overflow-hidden bg-background";

  const imageClass = aspectRatio === "square" ? "object-contain" : "object-cover";

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {currentPreview && !selectedFile && (
        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1">Current {label.toLowerCase()}:</p>
          <div className={containerClass}>
            <Image
              src={currentPreview}
              alt={`Current ${label.toLowerCase()}`}
              fill
              className={imageClass}
            />
          </div>
        </div>
      )}
      <Input
        id={id}
        ref={ref}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={disabled}
      />
      {preview && selectedFile && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">New {label.toLowerCase()} preview:</p>
          <div className={containerClass}>
            <Image
              src={preview}
              alt="Preview"
              fill
              className={imageClass}
            />
          </div>
        </div>
      )}
    </div>
  );
});

ImageUploadField.displayName = "ImageUploadField";

export default ImageUploadField;

