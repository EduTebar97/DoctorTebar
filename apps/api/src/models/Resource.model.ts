import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["checklist", "plantilla", "guia", "codigo", "bibliografia"], required: true },
    fileUrl: String,
    externalUrl: String,
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" }
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);
