import mongoose, { Schema } from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
});

export const OrganizationModel = mongoose.model(
  "Organization",
  OrganizationSchema
);
