import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByBusinessInfoId = query({
  args: { businessInfoId: v.id("businessInfo") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(args.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      return [];
    }

    const sections = await ctx.db
      .query("sections")
      .withIndex("by_businessInfoId", (q) => q.eq("businessInfoId", args.businessInfoId))
      .collect();

    return sections.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    businessInfoId: v.id("businessInfo"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(args.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Business info not found or unauthorized");
    }

    // Get current max order
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_businessInfoId", (q) => q.eq("businessInfoId", args.businessInfoId))
      .collect();

    const maxOrder = sections.length > 0 
      ? Math.max(...sections.map((s) => s.order))
      : -1;

    const sectionId = await ctx.db.insert("sections", {
      businessInfoId: args.businessInfoId,
      name: args.name.trim(),
      order: maxOrder + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return sectionId;
  },
});

export const update = mutation({
  args: {
    sectionId: v.id("sections"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(section.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.sectionId, {
      name: args.name.trim(),
      updatedAt: Date.now(),
    });

    return args.sectionId;
  },
});

export const remove = mutation({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(section.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete all items in this section
    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.sectionId);
    return args.sectionId;
  },
});

export const reorderSections = mutation({
  args: {
    businessInfoId: v.id("businessInfo"),
    sectionOrders: v.array(v.object({
      sectionId: v.id("sections"),
      newOrder: v.number(),
    })),
  },
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

    // Update order for each section
    for (const { sectionId, newOrder } of args.sectionOrders) {
      const section = await ctx.db.get(sectionId);
      if (!section || section.businessInfoId !== args.businessInfoId) {
        continue;
      }
      await ctx.db.patch(sectionId, {
        order: newOrder,
        updatedAt: Date.now(),
      });
    }

    return true;
  },
});

