import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Helper function to find business by slug
 */
async function findBusinessBySlug(ctx: any, slug: string) {
  const allBusinesses = await ctx.db.query("businessInfo").collect();
  return allBusinesses.find((b) => {
    const businessSlug = b.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return businessSlug === slug.toLowerCase();
  });
}

/**
 * Public query to get business info by slug (for validation)
 */
export const getByBusinessSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const business = await findBusinessBySlug(ctx, args.slug);
    if (!business) {
      return null;
    }
    return {
      _id: business._id,
      businessName: business.businessName,
    };
  },
});

/**
 * Public mutation to create an order (no authentication required)
 */
export const createOrder = mutation({
  args: {
    businessSlug: v.string(),
    items: v.array(v.object({
      itemId: v.id("menuItems"),
      name: v.string(),
      price: v.string(),
      quantity: v.number(),
    })),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate business exists
    const business = await findBusinessBySlug(ctx, args.businessSlug);
    if (!business) {
      throw new Error("Business not found");
    }

    // Validate items exist and belong to this business
    for (const orderItem of args.items) {
      const menuItem = await ctx.db.get(orderItem.itemId);
      if (!menuItem) {
        throw new Error(`Menu item ${orderItem.itemId} not found`);
      }

      // Verify item belongs to a section of this business
      const section = await ctx.db.get(menuItem.sectionId);
      if (!section || section.businessInfoId !== business._id) {
        throw new Error(`Menu item ${orderItem.itemId} does not belong to this business`);
      }
    }

    // Calculate total price
    const totalPrice = args.items.reduce((sum, item) => {
      const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + priceNum * item.quantity;
    }, 0);

    // Create order
    const orderId = await ctx.db.insert("orders", {
      businessInfoId: business._id,
      items: args.items,
      totalPrice: totalPrice.toFixed(2),
      customerName: args.customerName,
      createdAt: Date.now(),
    });

    return orderId;
  },
});

/**
 * Authenticated query to get all orders for a business
 */
export const getByBusinessInfoId = query({
  args: { businessInfoId: v.id("businessInfo") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(args.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Get all orders for this business
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessInfoId", (q) => q.eq("businessInfoId", args.businessInfoId))
      .collect();

    // Sort by creation date (newest first)
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

