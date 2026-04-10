import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAdminUser } from "./adminAuth";
import { isWaiterEnabled } from "./waiterFeatureGuard";

export const listApprovedWithBusiness = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdminUser(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const approved = await ctx.db
      .query("userAccess")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    const rows = await Promise.all(
      approved.map(async (u) => {
        const business = await ctx.db
          .query("businessInfo")
          .withIndex("by_userId", (q) => q.eq("userId", u.userId))
          .first();

        return {
          userId: u.userId,
          email: u.email,
          name: u.name,
          business: business
            ? {
                _id: business._id,
                businessName: business.businessName,
                waiterEnabled: isWaiterEnabled(business),
              }
            : null,
        };
      })
    );

    rows.sort((a, b) => {
      const an = (a.name || a.email || a.userId).toLowerCase();
      const bn = (b.name || b.email || b.userId).toLowerCase();
      return an.localeCompare(bn);
    });

    return rows;
  },
});

export const setWaiterEnabled = mutation({
  args: {
    businessInfoId: v.id("businessInfo"),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdminUser(ctx))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const business = await ctx.db.get(args.businessInfoId);
    if (!business) {
      throw new Error("Business not found");
    }

    await ctx.db.patch(args.businessInfoId, {
      waiterEnabled: args.enabled,
      updatedAt: Date.now(),
    });

    return { success: true as const };
  },
});
