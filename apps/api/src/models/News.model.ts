import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImageUrl: String,
    sourceName: String,
    sourceUrl: String,
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    publishedAt: Date
  },
  { timestamps: true }
);

export const News = mongoose.model("News", newsSchema);
