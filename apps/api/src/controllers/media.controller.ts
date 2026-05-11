import type { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { MediaAsset } from "../models/MediaAsset.model.js";
import { audit } from "../services/audit.service.js";
import { ApiError } from "../utils/ApiError.js";

export async function uploadMedia(req: Request, res: Response) {
  if (!req.file) throw new ApiError(400, "File is required");
  if (!env.cloudinary.cloudName) throw new ApiError(501, "Cloudinary is not configured");
  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "doctor-tebar", resource_type: "auto" });
  const asset = await MediaAsset.create({
    publicId: result.public_id,
    url: result.secure_url,
    mimeType: req.file.mimetype,
    size: req.file.size,
    originalName: req.file.originalname,
    uploadedBy: req.user?._id
  });
  await audit(req, "upload", "media", String(asset._id));
  res.status(201).json(asset);
}

export async function listMedia(_req: Request, res: Response) {
  res.json(await MediaAsset.find().sort({ createdAt: -1 }).limit(100));
}

export async function updateMedia(req: Request, res: Response) {
  const asset = await MediaAsset.findByIdAndUpdate(
    req.params.id,
    {
      altText: req.body.altText,
      caption: req.body.caption,
      credit: req.body.credit
    },
    { new: true, runValidators: true }
  );
  if (!asset) throw new ApiError(404, "Media not found");
  await audit(req, "update", "media", String(asset._id));
  res.json(asset);
}

export async function deleteMedia(req: Request, res: Response) {
  const asset = await MediaAsset.findByIdAndDelete(req.params.id);
  if (!asset) throw new ApiError(404, "Media not found");
  if (env.cloudinary.cloudName) await cloudinary.uploader.destroy(asset.publicId);
  await audit(req, "delete", "media", String(asset._id));
  res.status(204).send();
}
