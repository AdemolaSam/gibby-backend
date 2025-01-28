import mongoose, { Schema } from "mongoose";

export interface IUser {
  firstname: string;
  lastname: string;
  password: string;
  alias?: string;
  walletAddress?: string;
  email: string;
  role?: "admin" | "regular";
}

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true, select: false },
    alias: { type: String },
    walletAddress: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "regular", enum: ["admin", "regular"] },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);
