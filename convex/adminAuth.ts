import type { MutationCtx, QueryCtx } from "./_generated/server";

export async function isAdminUser(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    console.log("[Convex isAdmin] No identity found");
    return false;
  }

  const adminUserIds = process.env.ADMIN_USER_IDS;
  if (!adminUserIds) {
    console.log("[Convex isAdmin] ADMIN_USER_IDS not set in Convex environment variables");
    return false;
  }

  const adminIds = adminUserIds.split(",").map((id) => id.trim());
  const isAdmin = adminIds.includes(identity.subject);

  console.log("[Convex isAdmin] Check:", {
    userId: identity.subject,
    adminUserIds: adminUserIds ? "SET" : "NOT SET",
    adminIds,
    isAdmin,
  });

  return isAdmin;
}
