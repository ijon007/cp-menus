import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const businessInfo = await ctx.db
      .query("businessInfo")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return businessInfo;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Convert slug to potential business name formats
    const slugToName = (slug: string): string => {
      return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const potentialName = slugToName(args.slug);

    // Search for business info by matching business name (case-insensitive)
    const allBusinesses = await ctx.db.query("businessInfo").collect();
    
    const business = allBusinesses.find((b) => {
      const businessSlug = b.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return businessSlug === args.slug.toLowerCase();
    });

    return business || null;
  },
});

export const create = mutation({
  args: {
    businessName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if business info already exists
    const existing = await ctx.db
      .query("businessInfo")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        businessName: args.businessName,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new
    const businessInfoId = await ctx.db.insert("businessInfo", {
      userId: identity.subject,
      businessName: args.businessName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return businessInfoId;
  },
});

