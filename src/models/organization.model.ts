import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: Array },
  ownerId: { type: String },
  description: { type: String },
});

export const OrganizationModel = mongoose.model(
  "Organization",
  OrganizationSchema
);
