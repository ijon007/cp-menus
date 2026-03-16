'use client'

import { useEffect } from "react";

/* Next */
import { useParams, useRouter, useSearchParams } from "next/navigation";

/* Convex */
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/* Utils */
import { formatSlugToTitle } from "@/lib/utils";

/* Constants */
import { DEFAULT_TEMPLATE } from "@/constants/templates";
import { LivePublicMenuClient } from "./LivePublicMenuClient";
import { useLanguage } from "@/app/menu/useLanguage";

interface Item {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string | null;
}

interface Section {
  id: string;
  name: string;
  items: Item[];
}

function MenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const restaurantSlug = params["restaurant-slug"] as string;
  const tableParam = searchParams.get("table");

  let tableNumber: number | null = null;
  let sessionId: string | null = null;

  if (tableParam) {
    const [tablePart, sessionPart] = tableParam.split("_");
    if (tablePart && /^\d+$/.test(tablePart)) {
      tableNumber = parseInt(tablePart, 10);
    }
    if (sessionPart && sessionPart.trim().length > 0) {
      sessionId = sessionPart.trim();
    }
  }
  useEffect(() => {
    if (!tableNumber || sessionId) return;
    const randomSession = Math.random().toString(36).slice(2, 8);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("table", `${tableNumber}_${randomSession}`);
    router.replace(`?${newSearchParams.toString()}`);
  }, [tableNumber, sessionId, searchParams, router]);

  const menuData = useQuery(api.publicMenu.getByBusinessSlug, { slug: restaurantSlug });
  const { t } = useLanguage();

  if (menuData === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">{t.loadingMenu}</p>
          </div>
        </div>
      </div>
    );
  }

  const restaurantName = menuData.businessInfo?.businessName || formatSlugToTitle(restaurantSlug);
  const menuTemplate = menuData.businessInfo?.menuTemplate || DEFAULT_TEMPLATE;

  const sections: Section[] = menuData.sections;

  return (
    <LivePublicMenuClient
      restaurantName={restaurantName}
      restaurantSlug={restaurantSlug}
      tableNumber={tableNumber}
      sessionId={sessionId}
      sections={sections}
      businessInfo={{
        logoUrl: menuData.businessInfo?.logoUrl,
        bannerUrl: menuData.businessInfo?.bannerUrl,
        googleReviewUrl: menuData.businessInfo?.googleReviewUrl,
        tripAdvisorReviewUrl: menuData.businessInfo?.tripAdvisorReviewUrl,
        socialLinks: menuData.businessInfo?.socialLinks,
        menuTemplate,
        primaryColor: menuData.businessInfo?.primaryColor,
        secondaryColor: menuData.businessInfo?.secondaryColor,
        accentColor: menuData.businessInfo?.accentColor,
        backgroundColor: menuData.businessInfo?.backgroundColor,
      }}
    />
  );
}

export default MenuPage;