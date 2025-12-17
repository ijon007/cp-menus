"use client";

/* Next */
import Image from "next/image";

/* Components */
import { Button } from "@/components/ui/button";

/* Constants */
import { DEFAULT_IMAGES } from "@/constants/images";
import { COLORS } from "@/constants/colors";

interface RestaurantHeaderProps {
  businessName: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  googleReviewUrl?: string | null;
  tripAdvisorReviewUrl?: string | null;
  socialLinks?: {
    instagram?: string | null;
    facebook?: string | null;
  } | null;
  actions?: React.ReactNode;
  template?: string | null;
  primaryColor?: string | null;
}

export default function RestaurantHeader({
  businessName,
  logoUrl,
  bannerUrl,
  googleReviewUrl,
  tripAdvisorReviewUrl,
  socialLinks,
  actions,
  template,
  primaryColor,
}: RestaurantHeaderProps) {
  const displayLogo = logoUrl || DEFAULT_IMAGES.LOGO;
  const displayBanner = bannerUrl || DEFAULT_IMAGES.BANNER;
  const hasReviewLinks = googleReviewUrl || tripAdvisorReviewUrl;
  const hasSocialLinks = socialLinks && (socialLinks.instagram || socialLinks.facebook);
  const isModern = template === "modern";
  
  // Convert hex color to rgba with 60% opacity
  const getOverlayColor = (color: string): string => {
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }
    return color;
  };
  
  const overlayColor = primaryColor 
    ? getOverlayColor(primaryColor)
    : "rgba(74, 58, 42, 0.6)";

  return (
    <div className="relative w-full overflow-hidden" style={{ backgroundColor: COLORS.RESTAURANT_HEADER_BG }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={displayBanner}
          alt=""
          fill
          className={bannerUrl ? "object-cover" : "object-contain"}
          priority
        />
      </div>

      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ backgroundColor: overlayColor }}
      />

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-4 md:gap-6 mb-6">
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 border border-border rounded-full overflow-hidden bg-background">
            <Image
              src={displayLogo}
              alt={`${businessName} logo`}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-1">
              {businessName}
            </h1>
          </div>

          {actions && (
            <div className="flex items-center gap-2 flex-wrap">
              {actions}
            </div>
          )}
        </div>

        {(hasReviewLinks || hasSocialLinks) && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between">
            {hasReviewLinks && (
              <div className="flex flex-col items-start gap-4">
                <p className="text-white text-sm font-semibold whitespace-nowrap">
                  Give us a review
                </p>
                <div className="flex gap-3 flex-wrap">
                  {googleReviewUrl && (
                    <Button
                      variant="outline"
                      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${isModern ? "rounded-full p-4" : ""}`}
                      onClick={() => window.open(googleReviewUrl, "_blank")}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-white">Google</span>
                    </Button>
                  )}

                  {tripAdvisorReviewUrl && (
                    <Button
                      variant="outline"
                      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${isModern ? "rounded-full p-4" : ""}`}
                      onClick={() => window.open(tripAdvisorReviewUrl, "_blank")}
                    >
                      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" className="w-5 h-5 mr-2"><path d="M175.335 281.334c0 24.483-19.853 44.336-44.336 44.336-24.484 0-44.337-19.853-44.337-44.336 0-24.484 19.853-44.337 44.337-44.337 24.483 0 44.336 19.853 44.336 44.337zm205.554-44.337c-24.48 0-44.336 19.853-44.336 44.337 0 24.483 19.855 44.336 44.336 44.336 24.481 0 44.334-19.853 44.334-44.336-.006-24.47-19.839-44.31-44.309-44.323l-.025-.01v-.004zm125.002 44.337c0 68.997-55.985 124.933-124.999 124.933a124.466 124.466 0 01-84.883-33.252l-40.006 43.527-40.025-43.576a124.45 124.45 0 01-84.908 33.3c-68.968 0-124.933-55.937-124.933-124.932A124.586 124.586 0 0146.889 189L6 144.517h90.839c96.116-65.411 222.447-65.411 318.557 0H506l-40.878 44.484a124.574 124.574 0 0140.769 92.333zm-290.31 0c0-46.695-37.858-84.55-84.55-84.55-46.691 0-84.55 37.858-84.55 84.55 0 46.691 37.859 84.55 84.55 84.55 46.692 0 84.545-37.845 84.55-84.54v-.013.003zM349.818 155.1a244.01 244.01 0 00-187.666 0C215.532 175.533 256 223.254 256 278.893c0-55.634 40.463-103.362 93.826-123.786l-.005-.006h-.003zm115.64 126.224c0-46.694-37.858-84.55-84.55-84.55-46.691 0-84.552 37.859-84.552 84.55 0 46.692 37.855 84.55 84.553 84.55 46.697 0 84.55-37.858 84.55-84.55z" fill="#00AF87" fillRule="nonzero"/></svg>
                      <span className="text-white">TripAdvisor</span>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {hasSocialLinks && (
              <div className="flex flex-col items-start gap-4">
                <p className="text-white text-sm font-semibold whitespace-nowrap">
                  Follow us
                </p>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.instagram && (
                    <Button
                      variant="outline"
                      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${isModern ? "rounded-full p-4" : ""}`}
                      onClick={() => window.open(socialLinks.instagram!, "_blank")}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#833AB4" />
                            <stop offset="50%" stopColor="#FD1D1D" />
                            <stop offset="100%" stopColor="#FCB045" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)" />
                      </svg>
                      <span className="text-white">Instagram</span>
                    </Button>
                  )}
                  {socialLinks.facebook && (
                    <Button
                      variant="outline"
                      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${isModern ? "rounded-full p-4" : ""}`}
                      onClick={() => window.open(socialLinks.facebook!, "_blank")}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="#1877F2"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-white">Facebook</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

