import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

const backfillTranslations = httpAction(async (ctx, request) => {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = process.env.BACKFILL_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await ctx.runAction(internal.backfillTranslations.backfillAll, {});
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});

const backfillWaiterSessions = httpAction(async (ctx, request) => {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = process.env.BACKFILL_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await ctx.runAction(internal.backfillWaiterSessions.backfillAllSessions, {});
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});

http.route({
  path: "/backfill-translations",
  method: "POST",
  handler: backfillTranslations,
});

http.route({
  path: "/backfill-waiter-sessions",
  method: "POST",
  handler: backfillWaiterSessions,
});

export default http;
