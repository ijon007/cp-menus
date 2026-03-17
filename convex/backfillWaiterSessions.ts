import { internalAction, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const listCallsMissingSessionId = internalQuery({
  args: {},
  handler: async (ctx) => {
    const calls = await ctx.db.query("waiterCalls").collect();
    return calls.filter((c) => !c.sessionId || typeof c.sessionId !== "string");
  },
});

export const setCallSessionId = internalMutation({
  args: {
    id: v.id("waiterCalls"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      sessionId: args.sessionId,
    });
  },
});

export const backfillAllSessions: ReturnType<typeof internalAction> = internalAction({
  args: {},
  handler: async (ctx) => {
    const calls = await ctx.runQuery(internal.backfillWaiterSessions.listCallsMissingSessionId, {});

    let processed = 0;
    for (const call of calls) {
      try {
        const legacySessionId = `legacy-${call._id.id}`;
        await ctx.runMutation(internal.backfillWaiterSessions.setCallSessionId, {
          id: call._id,
          sessionId: legacySessionId,
        });
        processed += 1;
      } catch (err) {
        console.error(`Backfill failed for waiterCall ${call._id.id}:`, err);
      }
    }

    return { callsProcessed: processed, totalCallsMissingSessionId: calls.length };
  },
});

