import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    color: { type: String, default: "#16a34a" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
