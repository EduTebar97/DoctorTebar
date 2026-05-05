import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { settingsSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const settingsRoutes = Router();

settingsRoutes.get("/settings/public", asyncHandler(getSettings));
settingsRoutes.get("/admin/settings", requireAuth, asyncHandler(getSettings));
settingsRoutes.put("/admin/settings", requireAuth, validate(settingsSchema), asyncHandler(updateSettings));
