import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new ApiError(400, "File type not allowed"));
    return cb(null, true);
  }
});
