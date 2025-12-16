"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Logout05Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClerk } from "@clerk/nextjs";

function SettingsPage() {
  const router = useRouter();
  const businessInfo = useQuery(api.businessInfo.getByUserId);
  const generateUploadUrl = useMutation(api.businessInfo.generateUploadUrl);
  const updateBusinessInfo = useMutation(api.businessInfo.update);
  const { signOut } = useClerk();


  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [tripAdvisorReviewUrl, setTripAdvisorReviewUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
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
      setTwitterUrl(businessInfo.socialLinks?.twitter || "");
      if (businessInfo.logoUrl) {
        setLogoPreview(businessInfo.logoUrl);
      }
      if (businessInfo.bannerUrl) {
        setBannerPreview(businessInfo.bannerUrl);
      }
    }
  }, [businessInfo]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
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
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    await signOut();
    router.push("/");
  };

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
          twitter: twitterUrl.trim() || undefined,
        },
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
          <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <DialogTrigger render={<Button variant="destructive" />}>
              <HugeiconsIcon icon={Logout05Icon} strokeWidth={2} />
              <span>Log Out</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out? You will need to sign in again to access your menu.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setLogoutDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
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
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Joe's Restaurant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                {logoPreview && !selectedLogo && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Current logo:</p>
                    <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden bg-background">
                      <Image
                        src={logoPreview}
                        alt="Current logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                <Input
                  id="logo"
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={isSaving}
                />
                {logoPreview && selectedLogo && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">New logo preview:</p>
                    <div className="relative w-32 h-32 border border-border rounded-lg overflow-hidden bg-background">
                      <Image
                        src={logoPreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner">Banner</Label>
                {bannerPreview && !selectedBanner && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Current banner:</p>
                    <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden bg-background">
                      <Image
                        src={bannerPreview}
                        alt="Current banner"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <Input
                  id="banner"
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  disabled={isSaving}
                />
                {bannerPreview && selectedBanner && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">New banner preview:</p>
                    <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden bg-background">
                      <Image
                        src={bannerPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Review Links</h3>
              <p className="text-sm text-muted-foreground">Add links to your Google and TripAdvisor review pages</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-review-url">Google Review URL</Label>
                <Input
                  id="google-review-url"
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tripadvisor-review-url">TripAdvisor Review URL</Label>
                <Input
                  id="tripadvisor-review-url"
                  type="url"
                  value={tripAdvisorReviewUrl}
                  onChange={(e) => setTripAdvisorReviewUrl(e.target.value)}
                  placeholder="https://www.tripadvisor.com/..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Social Media Links</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram-url">Instagram URL</Label>
                <Input
                  id="instagram-url"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook-social-url">Facebook URL</Label>
                <Input
                  id="facebook-social-url"
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>

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

