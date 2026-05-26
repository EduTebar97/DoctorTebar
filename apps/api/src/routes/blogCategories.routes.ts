import { Router } from "express";
import { z } from "zod";
import { BlogCategory } from "../models/BlogCategory.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";

export const blogCategoriesRoutes = Router();

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(60),
    color: z.string().optional().or(z.literal("")),
    order: z.number().int().default(0)
  })
});

async function uniqueSlug(name: string, currentId?: string) {
  const base = slugify(name);
  const existing = await BlogCategory.findOne({ slug: base, ...(currentId ? { _id: { $ne: currentId } } : {}) });
  return existing ? `${base}-${Date.now()}` : base;
}

// Public — used by blog list and post editor to load categories
blogCategoriesRoutes.get("/blog-categories", asyncHandler(async (_req, res) => {
  const items = await BlogCategory.find().sort({ order: 1, name: 1 });
  res.json(items);
}));

// Admin CRUD
blogCategoriesRoutes.get("/admin/blog-categories", requireAuth, asyncHandler(async (_req, res) => {
  const items = await BlogCategory.find().sort({ order: 1, name: 1 });
  res.json(items);
}));

blogCategoriesRoutes.post("/admin/blog-categories", requireAuth, validate(categorySchema), asyncHandler(async (req, res) => {
  const { name, color, order } = req.body;
  const slug = await uniqueSlug(name);
  const item = await BlogCategory.create({ name, slug, color: color || "#16a34a", order: order ?? 0 });
  res.status(201).json(item);
}));

blogCategoriesRoutes.put("/admin/blog-categories/:id", requireAuth, validate(categorySchema.merge(idParamSchema)), asyncHandler(async (req, res) => {
  const { name, color, order } = req.body;
  const slug = await uniqueSlug(name, String(req.params.id));
  const item = await BlogCategory.findByIdAndUpdate(
    req.params.id,
    { $set: { name, slug, color: color || "#16a34a", order: order ?? 0 } },
    { new: true, runValidators: true }
  );
  if (!item) throw new ApiError(404, "Category not found");
  res.json(item);
}));

blogCategoriesRoutes.delete("/admin/blog-categories/:id", requireAuth, validate(idParamSchema), asyncHandler(async (req, res) => {
  const item = await BlogCategory.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Category not found");
  res.status(204).send();
}));
