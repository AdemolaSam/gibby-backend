import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
  userId: String,
  refreshTokens: String,
});

export const Token = mongoose.model("Token", TokenSchema);
