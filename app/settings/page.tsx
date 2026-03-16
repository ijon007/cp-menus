"use client";

/* Next */
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
import { Menu01Icon, Notification01Icon } from "@hugeicons/core-free-icons";
import LogoutDialog from "@/components/settings/logout-dialog";
import { CenteredFabBar } from "@/components/fab";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import BasicInformationSection from "@/components/settings/basic-information-section";
import ReviewLinksSection from "@/components/settings/review-links-section";
import SocialMediaLinksSection from "@/components/settings/social-media-links-section";
import TemplateSelectionSection from "@/components/settings/template-selection-section";
import ColorPickerSection from "@/components/settings/color-picker-section";
import { DEFAULT_TEMPLATE } from "@/constants/templates";

const DEBOUNCE_MS = 400;

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
  const [primaryColor, setPrimaryColor] = useState<string | null>(null);
  const [secondaryColor, setSecondaryColor] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [waiterSessionDurationMinutes, setWaiterSessionDurationMinutes] = useState<
    number | ""
  >("");
  const [isUploading, setIsUploading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formStateRef = useRef({
    businessName: "",
    googleReviewUrl: "",
    tripAdvisorReviewUrl: "",
    instagramUrl: "",
    facebookUrl: "",
  });

  useEffect(() => {
    formStateRef.current = {
      businessName,
      googleReviewUrl,
      tripAdvisorReviewUrl,
      instagramUrl,
      facebookUrl,
    };
  }, [businessName, googleReviewUrl, tripAdvisorReviewUrl, instagramUrl, facebookUrl]);

  // Initialize form with current business info
  useEffect(() => {
    if (businessInfo) {
      setBusinessName(businessInfo.businessName || "");
      setGoogleReviewUrl(businessInfo.googleReviewUrl || "");
      setTripAdvisorReviewUrl(businessInfo.tripAdvisorReviewUrl || "");
      setInstagramUrl(businessInfo.socialLinks?.instagram || "");
      setFacebookUrl(businessInfo.socialLinks?.facebook || "");
      setMenuTemplate(businessInfo.menuTemplate || DEFAULT_TEMPLATE);
      setPrimaryColor(businessInfo.primaryColor || null);
      setSecondaryColor(businessInfo.secondaryColor || null);
      setAccentColor(businessInfo.accentColor || null);
      setBackgroundColor(businessInfo.backgroundColor || null);
      setWaiterSessionDurationMinutes(
        businessInfo.waiterSessionDurationMinutes ?? ""
      );
      if (businessInfo.logoUrl) {
        setLogoPreview(businessInfo.logoUrl);
      }
      if (businessInfo.bannerUrl) {
        setBannerPreview(businessInfo.bannerUrl);
      }
    }
  }, [businessInfo]);

  const persistUpdate = useCallback(
    async (payload: Parameters<typeof updateBusinessInfo>[0]) => {
      try {
        await updateBusinessInfo(payload);
        toast.success("Settings updated");
      } catch (error) {
        console.error("Error updating business info:", error);
        toast.error("Failed to update settings. Please try again.");
      }
    },
    [updateBusinessInfo]
  );

  const flushDebouncedForm = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const s = formStateRef.current;
    persistUpdate({
      businessName: s.businessName.trim() || undefined,
      googleReviewUrl: s.googleReviewUrl.trim() || undefined,
      tripAdvisorReviewUrl: s.tripAdvisorReviewUrl.trim() || undefined,
      socialLinks: {
        instagram: s.instagramUrl.trim() || undefined,
        facebook: s.facebookUrl.trim() || undefined,
      },
    });
  }, [persistUpdate]);

  const schedulePersistForm = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(flushDebouncedForm, DEBOUNCE_MS);
  }, [flushDebouncedForm]);

  const onBusinessNameChange = useCallback(
    (v: string) => {
      setBusinessName(v);
      schedulePersistForm();
    },
    [schedulePersistForm]
  );
  const onGoogleReviewUrlChange = useCallback(
    (v: string) => {
      setGoogleReviewUrl(v);
      schedulePersistForm();
    },
    [schedulePersistForm]
  );
  const onTripAdvisorReviewUrlChange = useCallback(
    (v: string) => {
      setTripAdvisorReviewUrl(v);
      schedulePersistForm();
    },
    [schedulePersistForm]
  );
  const onInstagramUrlChange = useCallback(
    (v: string) => {
      setInstagramUrl(v);
      schedulePersistForm();
    },
    [schedulePersistForm]
  );
  const onFacebookUrlChange = useCallback(
    (v: string) => {
      setFacebookUrl(v);
      schedulePersistForm();
    },
    [schedulePersistForm]
  );

  const onMenuTemplateChange = useCallback(
    (v: string) => {
      setMenuTemplate(v);
      persistUpdate({ menuTemplate: v || undefined });
    },
    [persistUpdate]
  );
  const onPrimaryColorChange = useCallback(
    (v: string | null) => {
      setPrimaryColor(v);
      persistUpdate({ primaryColor: v ?? "" });
    },
    [persistUpdate]
  );
  const onSecondaryColorChange = useCallback(
    (v: string | null) => {
      setSecondaryColor(v);
      persistUpdate({ secondaryColor: v ?? "" });
    },
    [persistUpdate]
  );
  const onAccentColorChange = useCallback(
    (v: string | null) => {
      setAccentColor(v);
      persistUpdate({ accentColor: v ?? "" });
    },
    [persistUpdate]
  );
  const onBackgroundColorChange = useCallback(
    (v: string | null) => {
      setBackgroundColor(v);
      persistUpdate({ backgroundColor: v ?? "" });
    },
    [persistUpdate]
  );

  const onWaiterSessionDurationChange = useCallback(
    (value: string) => {
      const parsed = Number.parseInt(value, 10);
      const next: number | "" = Number.isNaN(parsed) ? "" : parsed;
      setWaiterSessionDurationMinutes(next);
      if (!Number.isNaN(parsed) && parsed > 0) {
        persistUpdate({ waiterSessionDurationMinutes: parsed });
      }
    },
    [persistUpdate]
  );

  useEffect(() => {
    if (!selectedLogo || !businessInfo) return;
    let cancelled = false;
    setIsUploading(true);
    (async () => {
      try {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedLogo.type },
          body: selectedLogo,
        });
        const { storageId } = await result.json();
        if (cancelled) return;
        await updateBusinessInfo({ logoStorageId: storageId as Id<"_storage"> });
        setSelectedLogo(null);
        setLogoPreviewUrl(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
        toast.success("Logo updated");
      } catch (error) {
        if (!cancelled) {
          console.error("Error uploading logo:", error);
          toast.error("Failed to upload logo. Please try again.");
        }
      } finally {
        if (!cancelled) setIsUploading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedLogo, businessInfo, generateUploadUrl, updateBusinessInfo]);

  useEffect(() => {
    if (!selectedBanner || !businessInfo) return;
    let cancelled = false;
    setIsUploading(true);
    (async () => {
      try {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedBanner.type },
          body: selectedBanner,
        });
        const { storageId } = await result.json();
        if (cancelled) return;
        await updateBusinessInfo({ bannerStorageId: storageId as Id<"_storage"> });
        setSelectedBanner(null);
        setBannerPreviewUrl(null);
        if (bannerInputRef.current) bannerInputRef.current.value = "";
        toast.success("Banner updated");
      } catch (error) {
        if (!cancelled) {
          console.error("Error uploading banner:", error);
          toast.error("Failed to upload banner. Please try again.");
        }
      } finally {
        if (!cancelled) setIsUploading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedBanner, businessInfo, generateUploadUrl, updateBusinessInfo]);

  if (businessInfo === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
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
        <div className="container mx-auto px-4 py-8 space-y-8">
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
            onBusinessNameChange={onBusinessNameChange}
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
            isUploading={isUploading}
          />

          <ReviewLinksSection
            googleReviewUrl={googleReviewUrl}
            onGoogleReviewUrlChange={onGoogleReviewUrlChange}
            tripAdvisorReviewUrl={tripAdvisorReviewUrl}
            onTripAdvisorReviewUrlChange={onTripAdvisorReviewUrlChange}
          />

          <SocialMediaLinksSection
            instagramUrl={instagramUrl}
            onInstagramUrlChange={onInstagramUrlChange}
            facebookUrl={facebookUrl}
            onFacebookUrlChange={onFacebookUrlChange}
          />

          <TemplateSelectionSection
            selectedTemplate={menuTemplate}
            onTemplateChange={onMenuTemplateChange}
          />

          <ColorPickerSection
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
            onPrimaryColorChange={onPrimaryColorChange}
            onSecondaryColorChange={onSecondaryColorChange}
            onAccentColorChange={onAccentColorChange}
            onBackgroundColorChange={onBackgroundColorChange}
          />

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Waiter call session
                </h3>
                <p className="text-sm text-muted-foreground">
                  Control how long a table session stays active for waiter calls.
                  Each session can call the waiter up to 3 times.
                </p>
              </div>
              <div className="flex max-w-xs flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Session duration (minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={waiterSessionDurationMinutes === "" ? "" : waiterSessionDurationMinutes}
                  onChange={(e) => onWaiterSessionDurationChange(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. 120"
                />
                <p className="text-xs text-muted-foreground">
                  After this time, a new session ID should be used for new waiter calls.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                href="/waiter"
                aria-label="Waiter dashboard"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-black/10 transition-colors"
              >
                <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-5" />
              </Link>
            }
          />
          <TooltipContent side="top">Waiter dashboard</TooltipContent>
        </Tooltip>
      </CenteredFabBar>
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

