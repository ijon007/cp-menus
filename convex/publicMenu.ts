import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByBusinessSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Get business info by slug
    const allBusinesses = await ctx.db.query("businessInfo").collect();
    
    const business = allBusinesses.find((b) => {
      const businessSlug = b.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return businessSlug === args.slug.toLowerCase();
    });

    // Get logo URL if available
    const logoUrl = business?.logoStorageId
      ? await ctx.storage.getUrl(business.logoStorageId)
      : null;

    // Get menu by userId if business exists
    // The menu name is typically "{businessName} Menu"
    let menu = null;
    if (business) {
      menu = await ctx.db
        .query("menus")
        .withIndex("by_userId", (q) => q.eq("userId", business.userId))
        .first();
    }
    
    // If no menu found via business, try to find by matching slug pattern
    // This handles cases where businessInfo doesn't exist yet
    if (!menu) {
      const allMenus = await ctx.db.query("menus").collect();
      menu = allMenus.find((m) => {
        // Convert menu name to slug (e.g., "Tacos Bros Menu" -> "tacos-bros")
        const menuNameSlug = m.name
          .toLowerCase()
          .replace(/\s+menu\s*$/i, "") // Remove " Menu" suffix
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return menuNameSlug === args.slug.toLowerCase();
      }) || null;
    }

    if (!menu) {
      return { 
        businessInfo: business ? {
          ...business,
          logoUrl,
        } : null, 
        sections: [] 
      };
    }

    // Get all sections from the single menu
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_menuId", (q) => q.eq("menuId", menu._id))
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
      businessInfo: business ? {
        ...business,
        logoUrl,
      } : null,
      sections: sortedSections,
    };
  },
});

