import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImageUrl: String,
    category: { type: String, enum: ["causalidad", "prediccion", "reporte", "stata", "errores", "general"], default: "general" },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
