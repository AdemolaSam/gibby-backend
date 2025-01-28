import { IsEnum } from "class-validator";
import mongoose, { Mongoose, Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    owner: { type: String },
    isStillOpen: { type: Boolean },
    closeDate: { type: Date },
    workStatus: { type: String, enum: ["initialised", "completed"] },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = mongoose.model("TaskModel", TaskSchema);
