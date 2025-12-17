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

    if (!businessInfo) {
      return null;
    }

    // Get logo URL if available
    const logoUrl = businessInfo.logoStorageId
      ? await ctx.storage.getUrl(businessInfo.logoStorageId)
      : null;

    // Get banner URL if available
    const bannerUrl = businessInfo.bannerStorageId
      ? await ctx.storage.getUrl(businessInfo.bannerStorageId)
      : null;

    return {
      ...businessInfo,
      socialLinks: businessInfo.socialLinks,
      logoUrl,
      bannerUrl,
    };
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
      
      // Auto-create menu if it doesn't exist
      const existingMenu = await ctx.db
        .query("menus")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .first();

      if (!existingMenu) {
        await ctx.db.insert("menus", {
          userId: identity.subject,
          name: `${args.businessName} Menu`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      
      return existing._id;
    }

    // Create new business info
    const businessInfoId = await ctx.db.insert("businessInfo", {
      userId: identity.subject,
      businessName: args.businessName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Auto-create menu with name "{businessName} Menu"
    await ctx.db.insert("menus", {
      userId: identity.subject,
      name: `${args.businessName} Menu`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return businessInfoId;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const update = mutation({
  args: {
    businessName: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    googleReviewUrl: v.optional(v.string()),
    tripAdvisorReviewUrl: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
      })
    ),
    menuTemplate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user's business info
    const businessInfo = await ctx.db
      .query("businessInfo")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!businessInfo) {
      throw new Error("Business info not found");
    }

    // Handle logo replacement: delete old logo if it exists and is being replaced
    if (args.logoStorageId !== undefined && businessInfo.logoStorageId && businessInfo.logoStorageId !== args.logoStorageId) {
      await ctx.storage.delete(businessInfo.logoStorageId);
    }

    // Handle banner replacement: delete old banner if it exists and is being replaced
    if (args.bannerStorageId !== undefined && businessInfo.bannerStorageId && businessInfo.bannerStorageId !== args.bannerStorageId) {
      await ctx.storage.delete(businessInfo.bannerStorageId);
    }

    // Build update object with only provided fields
    const updateData: {
      businessName?: string;
      logoStorageId?: typeof args.logoStorageId;
      bannerStorageId?: typeof args.bannerStorageId;
      googleReviewUrl?: string;
      tripAdvisorReviewUrl?: string;
      socialLinks?: typeof args.socialLinks;
      menuTemplate?: string;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.businessName !== undefined) {
      updateData.businessName = args.businessName.trim();
    }
    if (args.logoStorageId !== undefined) {
      updateData.logoStorageId = args.logoStorageId;
    }
    if (args.bannerStorageId !== undefined) {
      updateData.bannerStorageId = args.bannerStorageId;
    }
    if (args.googleReviewUrl !== undefined) {
      updateData.googleReviewUrl = args.googleReviewUrl.trim() || undefined;
    }
    if (args.tripAdvisorReviewUrl !== undefined) {
      updateData.tripAdvisorReviewUrl = args.tripAdvisorReviewUrl.trim() || undefined;
    }
    if (args.socialLinks !== undefined) {
      updateData.socialLinks = {
        instagram: args.socialLinks.instagram?.trim() || undefined,
        facebook: args.socialLinks.facebook?.trim() || undefined,
      };
    }
    if (args.menuTemplate !== undefined) {
      updateData.menuTemplate = args.menuTemplate;
    }

    await ctx.db.patch(businessInfo._id, updateData);

    return businessInfo._id;
  },
});

