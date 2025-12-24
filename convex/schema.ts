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
    menuTemplate: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),
  sections: defineTable({
    businessInfoId: v.id("businessInfo"),
    name: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_businessInfoId", ["businessInfoId"]),
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
  userAccess: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.optional(v.string()), // User email from Clerk
    name: v.optional(v.string()), // User name from Clerk
    status: v.string(), // "pending" | "approved" | "rejected"
    requestedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()), // Admin user ID
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),
});

