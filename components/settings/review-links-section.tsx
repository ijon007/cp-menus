"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLACEHOLDERS } from "@/constants/placeholders";

interface ReviewLinksSectionProps {
  googleReviewUrl: string;
  onGoogleReviewUrlChange: (url: string) => void;
  tripAdvisorReviewUrl: string;
  onTripAdvisorReviewUrlChange: (url: string) => void;
}

export default function ReviewLinksSection({
  googleReviewUrl,
  onGoogleReviewUrlChange,
  tripAdvisorReviewUrl,
  onTripAdvisorReviewUrlChange,
}: ReviewLinksSectionProps) {
  return (
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
            onChange={(e) => onGoogleReviewUrlChange(e.target.value)}
            placeholder={PLACEHOLDERS.GOOGLE_REVIEW_URL}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tripadvisor-review-url">TripAdvisor Review URL</Label>
          <Input
            id="tripadvisor-review-url"
            type="url"
            value={tripAdvisorReviewUrl}
            onChange={(e) => onTripAdvisorReviewUrlChange(e.target.value)}
            placeholder={PLACEHOLDERS.TRIPADVISOR_REVIEW_URL}
          />
        </div>
      </div>
    </div>
  );
}

