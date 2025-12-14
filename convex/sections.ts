import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByMenuId = query({
  args: { menuId: v.id("menus") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify menu belongs to user
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.userId !== identity.subject) {
      return [];
    }

    const sections = await ctx.db
      .query("sections")
      .withIndex("by_menuId", (q) => q.eq("menuId", args.menuId))
      .collect();

    return sections.sort((a, b) => a.order - b.order);
  },
});

export const create = mutation({
  args: {
    menuId: v.id("menus"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify menu belongs to user
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.userId !== identity.subject) {
      throw new Error("Menu not found or unauthorized");
    }

    // Get current max order
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_menuId", (q) => q.eq("menuId", args.menuId))
      .collect();

    const maxOrder = sections.length > 0 
      ? Math.max(...sections.map((s) => s.order))
      : -1;

    const sectionId = await ctx.db.insert("sections", {
      menuId: args.menuId,
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

    // Verify menu belongs to user
    const menu = await ctx.db.get(section.menuId);
    if (!menu || menu.userId !== identity.subject) {
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

    // Verify menu belongs to user
    const menu = await ctx.db.get(section.menuId);
    if (!menu || menu.userId !== identity.subject) {
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

