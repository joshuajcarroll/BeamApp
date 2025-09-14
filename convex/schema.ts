import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export const schema = defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),
});
