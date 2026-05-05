import { Router } from "express";
import { adminGet, adminList, createContent, deleteContent, publicDetail, publicList, setStatus, updateContent } from "../controllers/content.controller.js";
import { News } from "../models/News.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema, newsSchema, slugParamSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const newsRoutes = Router();

newsRoutes.get("/news", asyncHandler(publicList(News)));
newsRoutes.get("/news/:slug", validate(slugParamSchema), asyncHandler(publicDetail(News)));
newsRoutes.get("/admin/news", requireAuth, asyncHandler(adminList(News)));
newsRoutes.get("/admin/news/:id", requireAuth, validate(idParamSchema), asyncHandler(adminGet(News)));
newsRoutes.post("/admin/news", requireAuth, validate(newsSchema), asyncHandler(createContent(News, "news")));
newsRoutes.put("/admin/news/:id", requireAuth, validate(newsSchema.merge(idParamSchema)), asyncHandler(updateContent(News, "news")));
newsRoutes.delete("/admin/news/:id", requireAuth, validate(idParamSchema), asyncHandler(deleteContent(News, "news")));
newsRoutes.patch("/admin/news/:id/publish", requireAuth, validate(idParamSchema), asyncHandler(setStatus(News, "news", "published")));
newsRoutes.patch("/admin/news/:id/archive", requireAuth, validate(idParamSchema), asyncHandler(setStatus(News, "news", "archived")));
