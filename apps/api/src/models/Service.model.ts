import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    targetAudience: { type: String, required: true },
    deliverables: [{ type: String, trim: true }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
