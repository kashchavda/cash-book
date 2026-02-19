import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expireAt: { type: Date, required: true },
});

// Automatically remove expired tokens
tokenBlacklistSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
