import { Router } from "express";
import { createInquiry, deleteInquiry, getInquiry, listInquiries, updateInquiryNotes, updateInquiryStatus } from "../controllers/inquiries.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { inquiryRateLimit } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema, inquiryNotesSchema, inquirySchema, inquiryStatusSchema } from "../schemas/content.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const inquiriesRoutes = Router();

inquiriesRoutes.post("/inquiries", inquiryRateLimit, validate(inquirySchema), asyncHandler(createInquiry));
inquiriesRoutes.get("/admin/inquiries", requireAuth, asyncHandler(listInquiries));
inquiriesRoutes.get("/admin/inquiries/:id", requireAuth, validate(idParamSchema), asyncHandler(getInquiry));
inquiriesRoutes.patch("/admin/inquiries/:id/status", requireAuth, validate(inquiryStatusSchema), asyncHandler(updateInquiryStatus));
inquiriesRoutes.patch("/admin/inquiries/:id/notes", requireAuth, validate(inquiryNotesSchema), asyncHandler(updateInquiryNotes));
inquiriesRoutes.delete("/admin/inquiries/:id", requireAuth, validate(idParamSchema), asyncHandler(deleteInquiry));
