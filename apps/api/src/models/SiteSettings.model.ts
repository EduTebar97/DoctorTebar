import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, required: true },
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    aboutText: { type: String, required: true },
    contactEmail: { type: String, required: true },
    linkedinUrl: String,
    accentColor: String
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
