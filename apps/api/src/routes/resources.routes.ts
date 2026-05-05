import { Router } from "express";
import { adminGet, adminList, createContent, deleteContent, publicList, setStatus, updateContent } from "../controllers/content.controller.js";
import { Resource } from "../models/Resource.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema, resourceSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const resourcesRoutes = Router();

resourcesRoutes.get("/resources", asyncHandler(publicList(Resource, { createdAt: -1 })));
resourcesRoutes.get("/admin/resources", requireAuth, asyncHandler(adminList(Resource)));
resourcesRoutes.get("/admin/resources/:id", requireAuth, validate(idParamSchema), asyncHandler(adminGet(Resource)));
resourcesRoutes.post("/admin/resources", requireAuth, validate(resourceSchema), asyncHandler(createContent(Resource, "resource")));
resourcesRoutes.put("/admin/resources/:id", requireAuth, validate(resourceSchema.merge(idParamSchema)), asyncHandler(updateContent(Resource, "resource")));
resourcesRoutes.delete("/admin/resources/:id", requireAuth, validate(idParamSchema), asyncHandler(deleteContent(Resource, "resource")));
resourcesRoutes.patch("/admin/resources/:id/publish", requireAuth, validate(idParamSchema), asyncHandler(setStatus(Resource, "resource", "published")));
