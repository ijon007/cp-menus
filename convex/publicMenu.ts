import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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

    if (!business) {
      return { businessInfo: null, sections: [] };
    }

    // Get all menus for this business
    const menus = await ctx.db
      .query("menus")
      .withIndex("by_userId", (q) => q.eq("userId", business.userId))
      .collect();

    // Get all sections from all menus
    const allSections: Array<{
      _id: Id<"sections">;
      name: string;
      menuId: Id<"menus">;
      order: number;
    }> = [];

    for (const menu of menus) {
      const sections = await ctx.db
        .query("sections")
        .withIndex("by_menuId", (q) => q.eq("menuId", menu._id))
        .collect();
      
      allSections.push(...sections.map((s) => ({
        _id: s._id,
        name: s.name,
        menuId: menu._id,
        order: s.order,
      })));
    }

    // Get all items for all sections and group by section
    const sectionsWithItems = await Promise.all(
      allSections.map(async (section) => {
        const items = await ctx.db
          .query("menuItems")
          .withIndex("by_sectionId", (q) => q.eq("sectionId", section._id))
          .collect();

        return {
          id: section._id,
          name: section.name,
          items: items.map((item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
          })),
        };
      })
    );

    // Sort sections by order and filter out sections with no items
    const sortedSections = sectionsWithItems
      .filter((section) => section.items.length > 0)
      .sort((a, b) => {
        const aSection = allSections.find((s) => s._id === a.id);
        const bSection = allSections.find((s) => s._id === b.id);
        return (aSection?.order || 0) - (bSection?.order || 0);
      });

    return {
      businessInfo: business,
      sections: sortedSections,
    };
  },
});

