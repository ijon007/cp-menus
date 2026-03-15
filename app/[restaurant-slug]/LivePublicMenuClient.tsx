 "use client";

import { useState } from "react";
import { LanguageProvider, useLanguage } from "@/app/menu/useLanguage";
import RestaurantHeader from "@/components/public-menu/restaurant-header";
import CategorySelector from "@/components/public-menu/category-selector";
import TemplateRenderer from "@/components/public-menu/template-renderer";
import { CallWaiterFAB, LanguageFAB } from "@/components/public-menu/call-waiter-fab";

import type { TranslationMap } from "@/app/menu/i18n";

interface Item {
  id: string;
  name: string;
  nameTranslations?: TranslationMap;
  price: string;
  description?: string;
  descriptionTranslations?: TranslationMap;
  image?: string | null;
}

interface Section {
  id: string;
  name: string;
  nameTranslations?: TranslationMap;
  items: Item[];
}

interface LivePublicMenuClientProps {
  restaurantName: string;
  restaurantSlug: string;
  tableNumber: number | null;
  sections: Section[];
  businessInfo: {
    logoUrl?: string | null;
    bannerUrl?: string | null;
    googleReviewUrl?: string | null;
    tripAdvisorReviewUrl?: string | null;
    socialLinks?: {
      instagram?: string | null;
      facebook?: string | null;
    } | null;
    menuTemplate: string;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    accentColor?: string | null;
    backgroundColor?: string | null;
  } | null;
}

function LivePublicMenuContent({
  restaurantName,
  restaurantSlug,
  tableNumber,
  sections,
  businessInfo,
}: LivePublicMenuClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="min-h-screen bg-background"
      style={
        businessInfo?.backgroundColor
          ? {
              backgroundColor: businessInfo.backgroundColor,
            }
          : undefined
      }
    >
      <RestaurantHeader
        businessName={restaurantName}
        logoUrl={businessInfo?.logoUrl}
        bannerUrl={businessInfo?.bannerUrl}
        googleReviewUrl={businessInfo?.googleReviewUrl}
        tripAdvisorReviewUrl={businessInfo?.tripAdvisorReviewUrl}
        socialLinks={businessInfo?.socialLinks}
        template={businessInfo?.menuTemplate || ""}
        primaryColor={businessInfo?.primaryColor}
        reviewLabel={t.giveUsAReview}
        followUsLabel={t.followUs}
        googleLabel={t.googleLabel}
        tripAdvisorLabel={t.tripAdvisorLabel}
        instagramLabel={t.instagramLabel}
        facebookLabel={t.facebookLabel}
      />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {sections.length > 0 && (
          <CategorySelector
            sections={sections}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            primaryColor={businessInfo?.primaryColor}
            secondaryColor={businessInfo?.secondaryColor}
            accentColor={businessInfo?.accentColor}
            template={businessInfo?.menuTemplate || ""}
            backgroundColor={businessInfo?.backgroundColor}
          />
        )}

        <div>
          {sections.length > 0 ? (
            <TemplateRenderer
              template={businessInfo?.menuTemplate || ""}
              sections={sections}
              selectedCategory={selectedCategory}
              primaryColor={businessInfo?.primaryColor}
              secondaryColor={businessInfo?.secondaryColor}
              accentColor={businessInfo?.accentColor}
              backgroundColor={businessInfo?.backgroundColor}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t.noMenuItems}</p>
            </div>
          )}
        </div>
      </div>

      <CallWaiterFAB
        restaurantSlug={restaurantSlug}
        tableNumber={tableNumber}
        extraButtons={
          <LanguageFAB language={language} setLanguage={setLanguage} t={t} />
        }
      />
    </div>
  );
}

export function LivePublicMenuClient(props: LivePublicMenuClientProps) {
  return (
    <LanguageProvider>
      <LivePublicMenuContent {...props} />
    </LanguageProvider>
  );
}

