import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businessInfo: defineTable({
    userId: v.string(), // Clerk user ID
    businessName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),
  menus: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),
  sections: defineTable({
    menuId: v.id("menus"),
    name: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_menuId", ["menuId"]),
  menuItems: defineTable({
    sectionId: v.id("sections"),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sectionId", ["sectionId"]),
});

