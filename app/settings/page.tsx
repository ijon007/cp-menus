"use client";

/* Next */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* Convex */
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* Components */
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import LogoutDialog from "@/components/settings/logout-dialog";
import BasicInformationSection from "@/components/settings/basic-information-section";
import ReviewLinksSection from "@/components/settings/review-links-section";
import SocialMediaLinksSection from "@/components/settings/social-media-links-section";
import TemplateSelectionSection from "@/components/settings/template-selection-section";
import { DEFAULT_TEMPLATE } from "@/constants/templates";

function SettingsPage() {
  const router = useRouter();
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const generateUploadUrl = useMutation(api.businessInfo.generateUploadUrl);
  const updateBusinessInfo = useMutation(api.businessInfo.update);

  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [tripAdvisorReviewUrl, setTripAdvisorReviewUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [menuTemplate, setMenuTemplate] = useState<string>(DEFAULT_TEMPLATE);
  const [isSaving, setIsSaving] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with current business info
  useEffect(() => {
    if (businessInfo) {
      setBusinessName(businessInfo.businessName || "");
      setGoogleReviewUrl(businessInfo.googleReviewUrl || "");
      setTripAdvisorReviewUrl(businessInfo.tripAdvisorReviewUrl || "");
      setInstagramUrl(businessInfo.socialLinks?.instagram || "");
      setFacebookUrl(businessInfo.socialLinks?.facebook || "");
      setMenuTemplate(businessInfo.menuTemplate || DEFAULT_TEMPLATE);
      if (businessInfo.logoUrl) {
        setLogoPreview(businessInfo.logoUrl);
      }
      if (businessInfo.bannerUrl) {
        setBannerPreview(businessInfo.bannerUrl);
      }
    }
  }, [businessInfo]);


  const handleSave = async () => {
    if (!businessInfo) return;

    setIsSaving(true);

    try {
      let logoStorageId: Id<"_storage"> | undefined;
      let bannerStorageId: Id<"_storage"> | undefined;

      // Upload logo if selected
      if (selectedLogo) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedLogo.type },
          body: selectedLogo,
        });
        const { storageId } = await result.json();
        logoStorageId = storageId as Id<"_storage">;
      } else if (businessInfo.logoStorageId) {
        // Keep existing logo if no new logo selected
        logoStorageId = businessInfo.logoStorageId;
      }

      // Upload banner if selected
      if (selectedBanner) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedBanner.type },
          body: selectedBanner,
        });
        const { storageId } = await result.json();
        bannerStorageId = storageId as Id<"_storage">;
      } else if (businessInfo.bannerStorageId) {
        // Keep existing banner if no new banner selected
        bannerStorageId = businessInfo.bannerStorageId;
      }

      // Update business info
      await updateBusinessInfo({
        businessName: businessName.trim() || undefined,
        logoStorageId: logoStorageId,
        bannerStorageId: bannerStorageId,
        googleReviewUrl: googleReviewUrl.trim() || undefined,
        tripAdvisorReviewUrl: tripAdvisorReviewUrl.trim() || undefined,
        socialLinks: {
          instagram: instagramUrl.trim() || undefined,
          facebook: facebookUrl.trim() || undefined,
        },
        menuTemplate: menuTemplate || undefined,
      });

      toast.success("Settings saved successfully!");
      setSelectedLogo(null);
      setSelectedBanner(null);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error saving business info:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (businessInfo === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (businessInfo === null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Please create your business info first from the menu page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-accent"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </Button>
            <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          </div>
          <LogoutDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} />
        </div>

        <div className="space-y-8">
          <BasicInformationSection
            businessName={businessName}
            onBusinessNameChange={setBusinessName}
            logoPreview={logoPreview}
            selectedLogo={selectedLogo}
            setSelectedLogo={setSelectedLogo}
            logoPreviewUrl={logoPreviewUrl}
            setLogoPreviewUrl={setLogoPreviewUrl}
            logoInputRef={logoInputRef}
            bannerPreview={bannerPreview}
            selectedBanner={selectedBanner}
            setSelectedBanner={setSelectedBanner}
            bannerPreviewUrl={bannerPreviewUrl}
            setBannerPreviewUrl={setBannerPreviewUrl}
            bannerInputRef={bannerInputRef}
            isSaving={isSaving}
          />

          <ReviewLinksSection
            googleReviewUrl={googleReviewUrl}
            onGoogleReviewUrlChange={setGoogleReviewUrl}
            tripAdvisorReviewUrl={tripAdvisorReviewUrl}
            onTripAdvisorReviewUrlChange={setTripAdvisorReviewUrl}
          />

          <SocialMediaLinksSection
            instagramUrl={instagramUrl}
            onInstagramUrlChange={setInstagramUrl}
            facebookUrl={facebookUrl}
            onFacebookUrlChange={setFacebookUrl}
          />

          <TemplateSelectionSection
            selectedTemplate={menuTemplate}
            onTemplateChange={setMenuTemplate}
            disabled={isSaving}
          />

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || !businessName.trim()}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <SettingsPage />
      </Authenticated>
    </>
  );
}

