import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businessInfo: defineTable({
    userId: v.string(), // Clerk user ID
    businessName: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    googleReviewUrl: v.optional(v.string()),
    tripAdvisorReviewUrl: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      facebook: v.optional(v.string()),
    })),
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
    imageStorageId: v.optional(v.id("_storage")),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sectionId", ["sectionId"]),
});

