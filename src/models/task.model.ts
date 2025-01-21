import { Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    name: String,
    description: String,
    status: String,
    owner: String,
    isAvailable: String,
  },
  {
    timestamps: true,
  }
);
