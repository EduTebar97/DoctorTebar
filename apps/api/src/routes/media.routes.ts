import { Router } from "express";
import { deleteMedia, listMedia, updateMedia, uploadMedia } from "../controllers/media.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const mediaRoutes = Router();

mediaRoutes.post("/admin/media/upload", requireAuth, upload.single("file"), asyncHandler(uploadMedia));
mediaRoutes.get("/admin/media", requireAuth, asyncHandler(listMedia));
mediaRoutes.patch("/admin/media/:id", requireAuth, asyncHandler(updateMedia));
mediaRoutes.delete("/admin/media/:id", requireAuth, asyncHandler(deleteMedia));
