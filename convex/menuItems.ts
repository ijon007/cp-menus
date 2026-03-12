import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

const translationMapValidator = v.object({
  en: v.string(),
  sq: v.string(),
  it: v.string(),
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

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

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(section.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      return [];
    }

    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    const itemsWithUrls = await Promise.all(
      items.map(async (item) => {
        const imageUrl = item.imageStorageId
          ? await ctx.storage.getUrl(item.imageStorageId)
          : null;
        return {
          ...item,
          imageUrl,
        };
      })
    );

    return itemsWithUrls.sort((a, b) => {
      const orderA = a.order ?? a.createdAt;
      const orderB = b.order ?? b.createdAt;
      return orderA - orderB;
    });
  },
});

export const create = mutation({
  args: {
    sectionId: v.id("sections"),
    name: v.string(),
    nameTranslations: v.optional(translationMapValidator),
    price: v.string(),
    description: v.optional(v.string()),
    descriptionTranslations: v.optional(translationMapValidator),
    storageId: v.optional(v.id("_storage")),
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

    // Get current max order for this section
    const existingItems = await ctx.db
      .query("menuItems")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    const maxOrder = existingItems.length > 0
      ? Math.max(...existingItems.map((item) => item.order ?? -1))
      : -1;

    const nameTranslations = args.nameTranslations ?? {
      en: args.name.trim(),
      sq: args.name.trim(),
      it: args.name.trim(),
    };

    const desc = args.description?.trim() || undefined;
    const descriptionTranslations = args.descriptionTranslations ?? (desc
      ? { en: desc, sq: desc, it: desc }
      : undefined);

    const itemId = await ctx.db.insert("menuItems", {
      sectionId: args.sectionId,
      name: args.name.trim(),
      nameTranslations,
      price: args.price.trim(),
      description: desc,
      descriptionTranslations,
      imageStorageId: args.storageId,
      order: maxOrder + 1,
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
    nameTranslations: v.optional(translationMapValidator),
    price: v.string(),
    description: v.optional(v.string()),
    descriptionTranslations: v.optional(translationMapValidator),
    storageId: v.optional(v.id("_storage")),
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

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(section.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Handle image replacement/removal: delete old image if it exists and is being replaced or removed
    if (item.imageStorageId && item.imageStorageId !== args.storageId) {
      await ctx.storage.delete(item.imageStorageId);
    }

    const desc = args.description?.trim() || undefined;
    const nameTranslations = args.nameTranslations ?? {
      en: args.name.trim(),
      sq: args.name.trim(),
      it: args.name.trim(),
    };
    const descriptionTranslations = args.descriptionTranslations ?? (desc
      ? { en: desc, sq: desc, it: desc }
      : undefined);

    await ctx.db.patch(args.itemId, {
      name: args.name.trim(),
      nameTranslations,
      price: args.price.trim(),
      description: desc,
      descriptionTranslations,
      imageStorageId: args.storageId,
      updatedAt: Date.now(),
    });

    return args.itemId;
  },
});

export const patchTranslations = internalMutation({
  args: {
    itemId: v.id("menuItems"),
    nameTranslations: translationMapValidator,
    descriptionTranslations: v.optional(translationMapValidator),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      nameTranslations: args.nameTranslations,
      ...(args.descriptionTranslations && { descriptionTranslations: args.descriptionTranslations }),
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

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(section.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete associated image if it exists
    if (item.imageStorageId) {
      await ctx.storage.delete(item.imageStorageId);
    }

    await ctx.db.delete(args.itemId);
    return args.itemId;
  },
});

export const reorderItems = mutation({
  args: {
    sectionId: v.id("sections"),
    itemOrders: v.array(v.object({
      itemId: v.id("menuItems"),
      newOrder: v.number(),
    })),
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

    // Update order for each item
    for (const { itemId, newOrder } of args.itemOrders) {
      const item = await ctx.db.get(itemId);
      if (!item || item.sectionId !== args.sectionId) {
        continue;
      }
      await ctx.db.patch(itemId, {
        order: newOrder,
        updatedAt: Date.now(),
      });
    }

    return true;
  },
});

