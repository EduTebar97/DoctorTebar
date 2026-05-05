import { Router } from "express";
import { adminGet, adminList, createContent, deleteContent, publicList, setStatus, updateContent } from "../controllers/content.controller.js";
import { Service } from "../models/Service.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema, serviceSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const servicesRoutes = Router();

servicesRoutes.get("/services", asyncHandler(publicList(Service, { order: 1 })));
servicesRoutes.get("/admin/services", requireAuth, asyncHandler(adminList(Service)));
servicesRoutes.get("/admin/services/:id", requireAuth, validate(idParamSchema), asyncHandler(adminGet(Service)));
servicesRoutes.post("/admin/services", requireAuth, validate(serviceSchema), asyncHandler(createContent(Service, "service")));
servicesRoutes.put("/admin/services/:id", requireAuth, validate(serviceSchema.merge(idParamSchema)), asyncHandler(updateContent(Service, "service")));
servicesRoutes.delete("/admin/services/:id", requireAuth, validate(idParamSchema), asyncHandler(deleteContent(Service, "service")));
servicesRoutes.patch("/admin/services/:id/publish", requireAuth, validate(idParamSchema), asyncHandler(setStatus(Service, "service", "published")));
servicesRoutes.patch("/admin/services/:id/archive", requireAuth, validate(idParamSchema), asyncHandler(setStatus(Service, "service", "archived")));
