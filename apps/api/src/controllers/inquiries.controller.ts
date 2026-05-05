import type { Request, Response } from "express";
import { Inquiry } from "../models/Inquiry.model.js";
import { audit } from "../services/audit.service.js";
import { ApiError } from "../utils/ApiError.js";

export async function createInquiry(req: Request, res: Response) {
  const { consent: _consent, ...payload } = req.body;
  const inquiry = await Inquiry.create(payload);
  res.status(201).json(inquiry);
}

export async function listInquiries(_req: Request, res: Response) {
  res.json(await Inquiry.find().sort({ createdAt: -1 }).limit(100));
}

export async function getInquiry(req: Request, res: Response) {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, "Inquiry not found");
  res.json(inquiry);
}

export async function updateInquiryStatus(req: Request, res: Response) {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!inquiry) throw new ApiError(404, "Inquiry not found");
  await audit(req, "update-status", "inquiry", String(inquiry._id), { status: req.body.status });
  res.json(inquiry);
}

export async function updateInquiryNotes(req: Request, res: Response) {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { internalNotes: req.body.internalNotes }, { new: true });
  if (!inquiry) throw new ApiError(404, "Inquiry not found");
  await audit(req, "update-notes", "inquiry", String(inquiry._id));
  res.json(inquiry);
}

export async function deleteInquiry(req: Request, res: Response) {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) throw new ApiError(404, "Inquiry not found");
  await audit(req, "delete", "inquiry", String(inquiry._id));
  res.status(204).send();
}
