import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Helper function to find business by slug
 */
async function findBusinessBySlug(ctx: any, slug: string) {
  const allBusinesses = await ctx.db.query("businessInfo").collect();
  return allBusinesses.find((b: any) => {
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
    const now = Date.now();
    const orderId = await ctx.db.insert("orders", {
      businessInfoId: business._id,
      items: args.items,
      totalPrice: totalPrice.toString(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
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

    // Enrich orders with item images upfront (no lazy loading)
    const ordersWithImages = await Promise.all(
      orders.map(async (order) => {
        const itemsWithImages = await Promise.all(
          order.items.map(async (item) => {
            const menuItem = await ctx.db.get(item.itemId);
            const imageUrl = menuItem?.imageStorageId
              ? await ctx.storage.getUrl(menuItem.imageStorageId)
              : null;
            return {
              ...item,
              imageUrl,
            };
          })
        );
        return {
          ...order,
          items: itemsWithImages,
        };
      })
    );

    // Sort by creation date (newest first)
    return ordersWithImages.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Query to get order details with images (for lazy loading when expanded)
 */
export const getOrderDetails = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(order.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Enrich order with item images
    const itemsWithImages = await Promise.all(
      order.items.map(async (item) => {
        const menuItem = await ctx.db.get(item.itemId);
        const imageUrl = menuItem?.imageStorageId
          ? await ctx.storage.getUrl(menuItem.imageStorageId)
          : null;
        return {
          ...item,
          imageUrl,
        };
      })
    );

    return {
      ...order,
      items: itemsWithImages,
    };
  },
});

/**
 * Mutation to update order status
 */
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(), // "pending" | "completed"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(order.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    if (args.status !== "pending" && args.status !== "completed") {
      throw new Error("Invalid status");
    }

    const now = Date.now();
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: now,
    });

    return args.orderId;
  },
});

/**
 * Mutation to delete an order
 */
export const deleteOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Verify businessInfo belongs to user
    const businessInfo = await ctx.db.get(order.businessInfoId);
    if (!businessInfo || businessInfo.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.orderId);
    return args.orderId;
  },
});

/**
 * Mutation to clear all orders for today
 */
export const clearTodayOrders = mutation({
  args: {
    businessInfoId: v.id("businessInfo"),
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

    // Get start of today in milliseconds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    // Get all orders for this business created today
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessInfoId", (q) => q.eq("businessInfoId", args.businessInfoId))
      .collect();

    const todayOrders = orders.filter((order) => order.createdAt >= todayStart);

    // Delete all today's orders
    for (const order of todayOrders) {
      await ctx.db.delete(order._id);
    }

    return todayOrders.length;
  },
});

/**
 * Mutation to mark all today's orders as completed
 */
export const completeTodayOrders = mutation({
  args: {
    businessInfoId: v.id("businessInfo"),
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

    // Get start of today in milliseconds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    // Get all orders for this business created today
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessInfoId", (q) => q.eq("businessInfoId", args.businessInfoId))
      .collect();

    const todayOrders = orders.filter((order) => order.createdAt >= todayStart && order.status !== "completed");

    // Mark all today's pending orders as completed
    const now = Date.now();
    for (const order of todayOrders) {
      await ctx.db.patch(order._id, {
        status: "completed",
        updatedAt: now,
      });
    }

    return todayOrders.length;
  },
});

