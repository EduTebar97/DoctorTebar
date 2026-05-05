import { Router } from "express";
import { adminGet, adminList, createContent, deleteContent, publicDetail, publicList, setStatus, updateContent } from "../controllers/content.controller.js";
import { Post } from "../models/Post.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema, postSchema, slugParamSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const postsRoutes = Router();

postsRoutes.get("/posts", asyncHandler(publicList(Post)));
postsRoutes.get("/posts/:slug", validate(slugParamSchema), asyncHandler(publicDetail(Post)));
postsRoutes.get("/admin/posts", requireAuth, asyncHandler(adminList(Post)));
postsRoutes.get("/admin/posts/:id", requireAuth, validate(idParamSchema), asyncHandler(adminGet(Post)));
postsRoutes.post("/admin/posts", requireAuth, validate(postSchema), asyncHandler(createContent(Post, "post")));
postsRoutes.put("/admin/posts/:id", requireAuth, validate(postSchema.merge(idParamSchema)), asyncHandler(updateContent(Post, "post")));
postsRoutes.delete("/admin/posts/:id", requireAuth, validate(idParamSchema), asyncHandler(deleteContent(Post, "post")));
postsRoutes.patch("/admin/posts/:id/publish", requireAuth, validate(idParamSchema), asyncHandler(setStatus(Post, "post", "published")));
postsRoutes.patch("/admin/posts/:id/archive", requireAuth, validate(idParamSchema), asyncHandler(setStatus(Post, "post", "archived")));
