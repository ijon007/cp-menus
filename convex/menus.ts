import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const menu = await ctx.db
      .query("menus")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return menu || null;
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

export const create = mutation({
  args: {
    businessName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already has a menu
    const existingMenu = await ctx.db
      .query("menus")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (existingMenu) {
      // Update menu name if business name changed
      if (existingMenu.name !== `${args.businessName} Menu`) {
        await ctx.db.patch(existingMenu._id, {
          name: `${args.businessName} Menu`,
          updatedAt: Date.now(),
        });
      }
      return existingMenu._id;
    }

    // Create new menu with name "{businessName} Menu"
    const menuId = await ctx.db.insert("menus", {
      userId: identity.subject,
      name: `${args.businessName} Menu`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return menuId;
  },
});

