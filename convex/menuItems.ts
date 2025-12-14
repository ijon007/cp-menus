import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySectionId = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      return [];
    }

    // Verify menu belongs to user
    const menu = await ctx.db.get(section.menuId);
    if (!menu || menu.userId !== identity.subject) {
      return [];
    }

    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    return items.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const create = mutation({
  args: {
    sectionId: v.id("sections"),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
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

    // Verify menu belongs to user
    const menu = await ctx.db.get(section.menuId);
    if (!menu || menu.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const itemId = await ctx.db.insert("menuItems", {
      sectionId: args.sectionId,
      name: args.name.trim(),
      price: args.price.trim(),
      description: args.description?.trim() || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return itemId;
  },
});

export const update = mutation({
  args: {
    itemId: v.id("menuItems"),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const section = await ctx.db.get(item.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    // Verify menu belongs to user
    const menu = await ctx.db.get(section.menuId);
    if (!menu || menu.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.itemId, {
      name: args.name.trim(),
      price: args.price.trim(),
      description: args.description?.trim() || undefined,
      updatedAt: Date.now(),
    });

    return args.itemId;
  },
});

export const remove = mutation({
  args: {
    itemId: v.id("menuItems"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const section = await ctx.db.get(item.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    // Verify menu belongs to user
    const menu = await ctx.db.get(section.menuId);
    if (!menu || menu.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.itemId);
    return args.itemId;
  },
});

