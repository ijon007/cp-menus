import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";

async function requireCurrentBusiness(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const business = await ctx.db
    .query("businessInfo")
    .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
    .first();

  if (!business) {
    throw new Error("Business not found");
  }

  return { business, identity };
}

export const listByBusiness = query({
  args: {
    tableNumber: v.optional(v.number()),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { business } = await requireCurrentBusiness(ctx);

    if (
      args.tableNumber !== undefined &&
      (!Number.isInteger(args.tableNumber) || args.tableNumber < 1)
    ) {
      throw new Error("tableNumber must be a positive integer");
    }

    const notes = await (args.isCompleted !== undefined
      ? ctx.db
          .query("waiterNotes")
          .withIndex("by_businessInfoId_isCompleted_updatedAt", (q) =>
            q
              .eq("businessInfoId", business._id)
              .eq("isCompleted", args.isCompleted as boolean)
          )
      : ctx.db
          .query("waiterNotes")
          .withIndex("by_businessInfoId_tableNumber_updatedAt", (q) =>
            q.eq("businessInfoId", business._id)
          ))
      .order("desc")
      .collect();

    const filtered =
      args.tableNumber !== undefined
        ? notes.filter((n) => n.tableNumber === args.tableNumber)
        : notes;

    return filtered.map((n) => ({
      id: n._id,
      tableNumber: n.tableNumber,
      content: n.content,
      isCompleted: n.isCompleted,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      completedAt: n.completedAt ?? null,
    }));
  },
});

export const addNote = mutation({
  args: {
    tableNumber: v.number(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { business, identity } = await requireCurrentBusiness(ctx);

    if (!Number.isInteger(args.tableNumber) || args.tableNumber < 1) {
      throw new Error("tableNumber must be a positive integer");
    }

    const content = args.content.trim();
    if (!content) {
      throw new Error("Note content is required");
    }

    const now = Date.now();
    return await ctx.db.insert("waiterNotes", {
      businessInfoId: business._id,
      tableNumber: args.tableNumber,
      content,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      createdBy: identity.subject,
    });
  },
});

export const toggleNoteComplete = mutation({
  args: {
    id: v.id("waiterNotes"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { business } = await requireCurrentBusiness(ctx);

    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.businessInfoId !== business._id) {
      throw new Error("Not authorized");
    }

    const now = Date.now();
    if (args.isCompleted) {
      await ctx.db.patch(args.id, {
        isCompleted: true,
        updatedAt: now,
        completedAt: now,
      });
      return;
    }

    await ctx.db.patch(args.id, {
      isCompleted: false,
      updatedAt: now,
      completedAt: undefined,
    });
  },
});

export const clearCompletedByTable = mutation({
  args: {
    tableNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { business } = await requireCurrentBusiness(ctx);

    if (
      args.tableNumber !== undefined &&
      (!Number.isInteger(args.tableNumber) || args.tableNumber < 1)
    ) {
      throw new Error("tableNumber must be a positive integer");
    }

    const completedNotes = await ctx.db
      .query("waiterNotes")
      .withIndex("by_businessInfoId_isCompleted_updatedAt", (q) =>
        q.eq("businessInfoId", business._id).eq("isCompleted", true)
      )
      .collect();

    const toDelete =
      args.tableNumber !== undefined
        ? completedNotes.filter((note) => note.tableNumber === args.tableNumber)
        : completedNotes;

    await Promise.all(toDelete.map((note) => ctx.db.delete(note._id)));
    return { deleted: toDelete.length };
  },
});

export const deleteNote = mutation({
  args: { id: v.id("waiterNotes") },
  handler: async (ctx, args) => {
    const { business } = await requireCurrentBusiness(ctx);

    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.businessInfoId !== business._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
