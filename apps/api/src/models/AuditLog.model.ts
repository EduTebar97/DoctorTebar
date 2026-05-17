import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entity: { type: String, enum: ["post", "news", "resource", "service", "training", "settings", "user", "auth", "inquiry", "media", "system"], required: true },
    entityId: String,
    metadata: mongoose.Schema.Types.Mixed,
    ip: String,
    userAgent: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
