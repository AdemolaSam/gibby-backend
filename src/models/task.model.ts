import mongoose, { Schema } from "mongoose";

export interface ITask {
  name: string;
  description?: string;
  category?: string;
  tags?: string;
  owner: any;
  isStillOpen: boolean;
  source: string;
  closeDate: string;
  workStatus: "initialised" | "completed";
  createdAt: string;
  updatedAt: string;
}

const TaskSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    isStillOpen: { type: Boolean, default: true },
    source: { type: String },
    closeDate: { type: Date },
    workStatus: {
      type: String,
      enum: ["initialised", "completed"],
      default: "initialised",
    },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = mongoose.model("Task", TaskSchema);
