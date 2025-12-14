import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const menus = await ctx.db
      .query("menus")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    return menus.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getById = query({
  args: { menuId: v.id("menus") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.userId !== identity.subject) {
      return null;
    }

    return menu;
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const menus = await ctx.db
      .query("menus")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    return menus.find((menu) => menu.name === args.name) || null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const menuId = await ctx.db.insert("menus", {
      userId: identity.subject,
      name: args.name.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return menuId;
  },
});

export const update = mutation({
  args: {
    menuId: v.id("menus"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.userId !== identity.subject) {
      throw new Error("Menu not found or unauthorized");
    }

    await ctx.db.patch(args.menuId, {
      name: args.name.trim(),
      updatedAt: Date.now(),
    });

    return args.menuId;
  },
});

export const remove = mutation({
  args: {
    menuId: v.id("menus"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.userId !== identity.subject) {
      throw new Error("Menu not found or unauthorized");
    }

    // Delete all sections and items for this menu
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_menuId", (q) => q.eq("menuId", args.menuId))
      .collect();

    for (const section of sections) {
      const items = await ctx.db
        .query("menuItems")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", section._id))
        .collect();

      for (const item of items) {
        await ctx.db.delete(item._id);
      }

      await ctx.db.delete(section._id);
    }

    await ctx.db.delete(args.menuId);
    return args.menuId;
  },
});

