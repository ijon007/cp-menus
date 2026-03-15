import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const callWaiter = mutation({
  args: {
    slug: v.string(),
    tableNumber: v.number(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.tableNumber) || args.tableNumber < 1) {
      throw new Error("tableNumber must be a positive integer");
    }

    const allBusinesses = await ctx.db.query("businessInfo").collect();
    const business = allBusinesses.find(
      (b) => slugifyName(b.businessName) === args.slug.toLowerCase()
    );

    if (!business) {
      throw new Error("Business not found");
    }

    const id = await ctx.db.insert("waiterCalls", {
      businessInfoId: business._id,
      tableNumber: args.tableNumber,
      triggeredAt: Date.now(),
    });

    return { id };
  },
});

export const listForCurrentBusiness = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const business = await ctx.db
      .query("businessInfo")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!business) {
      return [];
    }

    const calls = await ctx.db
      .query("waiterCalls")
      .withIndex("by_businessInfoId_triggeredAt", (q) =>
        q.eq("businessInfoId", business._id)
      )
      .order("desc")
      .collect();

    return calls.map((c) => ({
      id: c._id,
      tableNumber: c.tableNumber,
      triggeredAt: c.triggeredAt,
    }));
  },
});

export const confirmWaiterCall = mutation({
  args: { id: v.id("waiterCalls") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const call = await ctx.db.get(args.id);
    if (!call) {
      throw new Error("Waiter call not found");
    }

    const business = await ctx.db
      .query("businessInfo")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!business || business._id !== call.businessInfoId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const clearWaiterCall = mutation({
  args: { id: v.id("waiterCalls") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const call = await ctx.db.get(args.id);
    if (!call) {
      throw new Error("Waiter call not found");
    }

    const business = await ctx.db
      .query("businessInfo")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!business || business._id !== call.businessInfoId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
