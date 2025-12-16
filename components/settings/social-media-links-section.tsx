"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLACEHOLDERS } from "@/constants/placeholders";

interface SocialMediaLinksSectionProps {
  instagramUrl: string;
  onInstagramUrlChange: (url: string) => void;
  facebookUrl: string;
  onFacebookUrlChange: (url: string) => void;
}

export default function SocialMediaLinksSection({
  instagramUrl,
  onInstagramUrlChange,
  facebookUrl,
  onFacebookUrlChange,
}: SocialMediaLinksSectionProps) {
  return (
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
            onChange={(e) => onInstagramUrlChange(e.target.value)}
            placeholder={PLACEHOLDERS.INSTAGRAM_URL}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook-social-url">Facebook URL</Label>
          <Input
            id="facebook-social-url"
            type="url"
            value={facebookUrl}
            onChange={(e) => onFacebookUrlChange(e.target.value)}
            placeholder={PLACEHOLDERS.FACEBOOK_URL}
          />
        </div>
      </div>
    </div>
  );
}

