import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isWaiterEnabled } from "./waiterFeatureGuard";

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
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.tableNumber) || args.tableNumber < 1) {
      throw new Error("tableNumber must be a positive integer");
    }

    if (!args.sessionId || args.sessionId.trim().length === 0) {
      throw new Error("sessionId is required");
    }

    const allBusinesses = await ctx.db.query("businessInfo").collect();
    const business = allBusinesses.find(
      (b) => slugifyName(b.businessName) === args.slug.toLowerCase()
    );

    if (!business) {
      throw new Error("Business not found");
    }

    if (!isWaiterEnabled(business)) {
      throw new Error("Waiter calls are not enabled for this restaurant.");
    }

    const now = Date.now();
    const configured = business.waiterSessionDurationMinutes;
    const sessionMinutes =
      typeof configured === "number" &&
      Number.isFinite(configured) &&
      configured >= 5 &&
      configured <= 480
        ? Math.round(configured)
        : 15;
    const sessionWindowMs = sessionMinutes * 60 * 1000;

    const activeCalls = await ctx.db
      .query("waiterCalls")
      .withIndex("by_businessInfoId_tableNumber_sessionId", (q) =>
        q
          .eq("businessInfoId", business._id)
          .eq("tableNumber", args.tableNumber)
          .eq("sessionId", args.sessionId)
      )
      .collect();

    const nonExpiredCalls = activeCalls.filter(
      (c) => now - c.triggeredAt < sessionWindowMs
    );

    if (nonExpiredCalls.length >= 3) {
      return { id: null, limitReached: true as const };
    }

    const id = await ctx.db.insert("waiterCalls", {
      businessInfoId: business._id,
      tableNumber: args.tableNumber,
      sessionId: args.sessionId,
      triggeredAt: now,
    });

    await ctx.scheduler.runAt(
      now + sessionWindowMs,
      internal.waiterCalls.expireWaiterCall,
      { id }
    );

    return { id, limitReached: false as const };
  },
});

export const expireWaiterCall = internalMutation({
  args: { id: v.id("waiterCalls") },
  handler: async (ctx, args) => {
    const call = await ctx.db.get(args.id);
    if (!call) {
      return;
    }

    await ctx.db.delete(args.id);
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

    if (!isWaiterEnabled(business)) {
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
      sessionId: c.sessionId,
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

    if (!isWaiterEnabled(business)) {
      throw new Error("Waiter features are not enabled for this business");
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

    if (!isWaiterEnabled(business)) {
      throw new Error("Waiter features are not enabled for this business");
    }

    await ctx.db.delete(args.id);
  },
});
