import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: String,
    projectStage: { type: String, enum: ["idea", "protocolo", "analisis", "manuscrito", "revision"], required: true },
    objectiveType: { type: String, enum: ["causal", "predictivo", "descriptivo", "diagnostico", "pronostico", "mixto", "no_claro"], required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "pending_reply", "replied", "meeting_proposed", "proposal_sent", "accepted", "discarded", "archived"],
      default: "new"
    },
    internalNotes: String,
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    estimatedValue: Number,
    nextAction: String,
    nextActionAt: Date,
    source: { type: String, enum: ["contact_form", "linkedin", "email", "referral", "other"], default: "contact_form" },
    serviceInterest: String
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
