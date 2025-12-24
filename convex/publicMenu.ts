import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByBusinessSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // First, find the business info by business name slug
    const allBusinesses = await ctx.db.query("businessInfo").collect();
    const business = allBusinesses.find((b) => {
      // Convert business name to slug (same logic as titleToSlug)
      const businessSlug = b.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return businessSlug === args.slug.toLowerCase();
    });

    if (!business) {
      return {
        businessInfo: null,
        sections: [],
      };
    }

    // Get logo URL if available
    const logoUrl = business.logoStorageId
      ? await ctx.storage.getUrl(business.logoStorageId)
      : null;

    // Get banner URL if available
    const bannerUrl = business.bannerStorageId
      ? await ctx.storage.getUrl(business.bannerStorageId)
      : null;

    // Build businessInfo object
    const businessInfo = {
      businessName: business.businessName,
      googleReviewUrl: business.googleReviewUrl,
      tripAdvisorReviewUrl: business.tripAdvisorReviewUrl,
      socialLinks: business.socialLinks,
      menuTemplate: business.menuTemplate,
      primaryColor: business.primaryColor,
      secondaryColor: business.secondaryColor,
      accentColor: business.accentColor,
      backgroundColor: business.backgroundColor,
      logoUrl,
      bannerUrl,
    };

    // Get all sections for this businessInfo
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_businessInfoId", (q) => q.eq("businessInfoId", business._id))
      .collect();

    // Get all items for all sections and group by section
    const sectionsWithItems = await Promise.all(
      sections.map(async (section) => {
        const items = await ctx.db
          .query("menuItems")
          .withIndex("by_sectionId", (q) => q.eq("sectionId", section._id))
          .collect();

        const itemsWithImages = await Promise.all(
          items.map(async (item) => {
            const image = item.imageStorageId
              ? await ctx.storage.getUrl(item.imageStorageId)
              : null;
            return {
              id: item._id,
              name: item.name,
              price: item.price,
              description: item.description,
              image,
            };
          })
        );

        return {
          id: section._id,
          name: section.name,
          items: itemsWithImages,
        };
      })
    );

    // Sort sections by order and filter out sections with no items
    const sortedSections = sectionsWithItems
      .filter((section) => section.items.length > 0)
      .sort((a, b) => {
        const aSection = sections.find((s) => s._id === a.id);
        const bSection = sections.find((s) => s._id === b.id);
        return (aSection?.order || 0) - (bSection?.order || 0);
      });

    return {
      businessInfo,
      sections: sortedSections,
    };
  },
});

