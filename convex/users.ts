import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserbyClerkUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return user;
  },
});

export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { userId, name, email, imageUrl }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name,
        imageUrl,
      });
      return existingUser._id;
    }
    return await ctx.db.insert("users", {
      userId,
      name,
      email,
      imageUrl,
    });
  },
});

//Search users by name or email
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) {
      return [];
    }

    const normalizedTerm = searchTerm.trim().toLowerCase();

    const allUsers = await ctx.db.query("users").collect();
    const filteredUsers = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedTerm) ||
        user.email.toLowerCase().includes(normalizedTerm)
    );
    return filteredUsers.slice(0, 20); // Limit to 20 results
  },
});
