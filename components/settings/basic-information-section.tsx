"use client";

import { useState, useRef, RefObject } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploadField from "./image-upload-field";
import { PLACEHOLDERS } from "@/constants/placeholders";

interface BasicInformationSectionProps {
  businessName: string;
  onBusinessNameChange: (name: string) => void;
  logoPreview: string | null;
  selectedLogo: File | null;
  setSelectedLogo: (file: File | null) => void;
  logoPreviewUrl: string | null;
  setLogoPreviewUrl: (url: string | null) => void;
  logoInputRef?: RefObject<HTMLInputElement | null>;
  bannerPreview: string | null;
  selectedBanner: File | null;
  setSelectedBanner: (file: File | null) => void;
  bannerPreviewUrl: string | null;
  setBannerPreviewUrl: (url: string | null) => void;
  bannerInputRef?: RefObject<HTMLInputElement | null>;
  isSaving: boolean;
}

export default function BasicInformationSection({
  businessName,
  onBusinessNameChange,
  logoPreview,
  selectedLogo,
  setSelectedLogo,
  logoPreviewUrl,
  setLogoPreviewUrl,
  logoInputRef,
  bannerPreview,
  selectedBanner,
  setSelectedBanner,
  bannerPreviewUrl,
  setBannerPreviewUrl,
  bannerInputRef,
  isSaving,
}: BasicInformationSectionProps) {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Basic Information</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            placeholder={PLACEHOLDERS.BUSINESS_NAME}
          />
        </div>

        <ImageUploadField
          id="logo"
          label="Logo"
          currentPreview={logoPreview}
          selectedFile={selectedLogo}
          preview={logoPreviewUrl}
          onFileChange={handleLogoChange}
          disabled={isSaving}
          aspectRatio="square"
          ref={logoInputRef}
        />

        <ImageUploadField
          id="banner"
          label="Banner"
          currentPreview={bannerPreview}
          selectedFile={selectedBanner}
          preview={bannerPreviewUrl}
          onFileChange={handleBannerChange}
          disabled={isSaving}
          aspectRatio="wide"
          ref={bannerInputRef}
        />
      </div>
    </div>
  );
}

