import type { Model } from "mongoose";
import type { Request, Response } from "express";
import { News } from "../models/News.model.js";
import { Post } from "../models/Post.model.js";
import { Resource } from "../models/Resource.model.js";
import { Service } from "../models/Service.model.js";
import { audit } from "../services/audit.service.js";
import { ApiError } from "../utils/ApiError.js";
import { pagination } from "../utils/pagination.js";
import { sanitizeRichHtml } from "../utils/sanitizeHtml.js";
import { slugify } from "../utils/slugify.js";

type Entity = "post" | "news" | "resource" | "service";

async function uniqueSlug(model: Model<any>, title: string, currentId?: string) {
  const base = slugify(title);
  const existing = await model.findOne({ slug: base, ...(currentId ? { _id: { $ne: currentId } } : {}) });
  return existing ? `${base}-${Date.now()}` : base;
}

function publicFilter(req: Request) {
  const filter: Record<string, unknown> = { status: "published" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    const q = new RegExp(String(req.query.q), "i");
    filter.$or = [{ title: q }, { excerpt: q }, { tags: q }, { description: q }];
  }
  return filter;
}

export function publicList(model: Model<any>, sort: Record<string, 1 | -1> = { publishedAt: -1, createdAt: -1 }) {
  return async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req.query);
    const items = await model.find(publicFilter(req)).sort(sort).skip(skip).limit(limit);
    res.json(items);
  };
}

export function publicDetail(model: Model<any>) {
  return async (req: Request, res: Response) => {
    const item = await model.findOne({ slug: req.params.slug, status: "published" });
    if (!item) throw new ApiError(404, "Content not found");
    res.json(item);
  };
}

export function adminList(model: Model<any>) {
  return async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req.query);
    const filter = req.query.status ? { status: req.query.status } : {};
    const items = await model.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    res.json(items);
  };
}

export function adminGet(model: Model<any>) {
  return async (req: Request, res: Response) => {
    const item = await model.findById(req.params.id);
    if (!item) throw new ApiError(404, "Content not found");
    res.json(item);
  };
}

export function createContent(model: Model<any>, entity: Entity) {
  return async (req: Request, res: Response) => {
    const payload = { ...req.body };
    if ("content" in payload) payload.content = sanitizeRichHtml(payload.content);
    if ("title" in payload && entity !== "resource") payload.slug = await uniqueSlug(model, payload.title);
    if (entity === "post") payload.authorId = req.user?._id;
    if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
    const item = await model.create(payload);
    await audit(req, "create", entity, String(item._id));
    res.status(201).json(item);
  };
}

export function updateContent(model: Model<any>, entity: Entity) {
  return async (req: Request, res: Response) => {
    const payload = { ...req.body };
    if ("content" in payload) payload.content = sanitizeRichHtml(payload.content);
    if ("title" in payload && entity !== "resource") payload.slug = await uniqueSlug(model, payload.title, String(req.params.id));
    if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
    const item = await model.findByIdAndUpdate(String(req.params.id), payload, { new: true, runValidators: true });
    if (!item) throw new ApiError(404, "Content not found");
    await audit(req, "update", entity, String(item._id));
    res.json(item);
  };
}

export function deleteContent(model: Model<any>, entity: Entity) {
  return async (req: Request, res: Response) => {
    const item = await model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, "Content not found");
    await audit(req, "delete", entity, String(item._id));
    res.status(204).send();
  };
}

export function setStatus(model: Model<any>, entity: Entity, status: "published" | "archived" | "draft") {
  return async (req: Request, res: Response) => {
    const update: Record<string, unknown> = { status };
    if (status === "published") update.publishedAt = new Date();
    const item = await model.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) throw new ApiError(404, "Content not found");
    await audit(req, status, entity, String(item._id));
    res.json(item);
  };
}

export const contentModels = { Post, News, Resource, Service };
