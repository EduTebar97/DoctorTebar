import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: String,
    projectStage: { type: String, enum: ["idea", "protocolo", "analisis", "manuscrito", "revision"], required: true },
    objectiveType: { type: String, enum: ["causal", "predictivo", "descriptivo", "diagnostico", "pronostico", "mixto", "no_claro"], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "reviewed", "replied", "archived"], default: "new" },
    internalNotes: String
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
