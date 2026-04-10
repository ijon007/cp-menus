import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { isAdminUser } from "./adminAuth";

// Check access status for current user
export const checkAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { status: null, accessRecord: null };
    }

    const accessRecord = await ctx.db
      .query("userAccess")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return {
      status: accessRecord?.status || null,
      accessRecord: accessRecord
        ? {
            _id: accessRecord._id,
            userId: accessRecord.userId,
            email: accessRecord.email,
            name: accessRecord.name,
            status: accessRecord.status,
            requestedAt: accessRecord.requestedAt,
            reviewedAt: accessRecord.reviewedAt,
            reviewedBy: accessRecord.reviewedBy,
          }
        : null,
    };
  },
});

// Request access - creates a pending record if one doesn't exist
export const requestAccess = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if record already exists
    const existingRecord = await ctx.db
      .query("userAccess")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (existingRecord) {
      // Update email/name if they're not set but are available now
      const needsUpdate = 
        (!existingRecord.email && (identity as any).email) ||
        (!existingRecord.name && (identity as any).name);
      
      if (needsUpdate) {
        await ctx.db.patch(existingRecord._id, {
          email: existingRecord.email || (identity as any).email || undefined,
          name: existingRecord.name || (identity as any).name || undefined,
        });
      }
      return { success: true, alreadyExists: true };
    }

    // Create new pending record
    await ctx.db.insert("userAccess", {
      userId: identity.subject,
      email: (identity as any).email || undefined,
      name: (identity as any).name || undefined,
      status: "pending",
      requestedAt: Date.now(),
    });

    return { success: true, alreadyExists: false };
  },
});

// Check if current user is admin
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await isAdminUser(ctx);
  },
});

// Get all pending users (admin only)
export const getPendingUsers = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdminUser(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const pendingUsers = await ctx.db
      .query("userAccess")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return pendingUsers.map((user) => ({
      _id: user._id,
      userId: user.userId,
      email: user.email,
      name: user.name,
      status: user.status,
      requestedAt: user.requestedAt,
    }));
  },
});

// Get all users with their status (admin only)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdminUser(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const allUsers = await ctx.db.query("userAccess").collect();

    return allUsers.map((user) => ({
      _id: user._id,
      userId: user.userId,
      email: user.email,
      name: user.name,
      status: user.status,
      requestedAt: user.requestedAt,
      reviewedAt: user.reviewedAt,
      reviewedBy: user.reviewedBy,
    }));
  },
});

// Approve a user (admin only)
export const approveUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdminUser(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const accessRecord = await ctx.db
      .query("userAccess")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!accessRecord) {
      throw new Error("User access record not found");
    }

    await ctx.db.patch(accessRecord._id, {
      status: "approved",
      reviewedAt: Date.now(),
      reviewedBy: identity.subject,
    });

    return { success: true };
  },
});

// Reject a user (admin only)
export const rejectUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdminUser(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const accessRecord = await ctx.db
      .query("userAccess")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!accessRecord) {
      throw new Error("User access record not found");
    }

    await ctx.db.patch(accessRecord._id, {
      status: "rejected",
      reviewedAt: Date.now(),
      reviewedBy: identity.subject,
    });

    return { success: true };
  },
});

