import mongoose, { Schema } from "mongoose";

export interface IUser {
  firstname: string;
  lastname: string;
  password: string;
  alias: string;
  walletAddress?: string;
  email: string;
  role?: "admin" | "regular";
}

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true, select: false },
  alias: { type: String, required: false },
  walletAddress: { type: String, required: false },
  email: { type: String, required: true },
  role: { type: String, default: "regular", enum: ["admin", "regular"] },
});

export const UserModel = mongoose.model("User", userSchema);
