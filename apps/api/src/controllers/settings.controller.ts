import type { Request, Response } from "express";
import { SiteSettings } from "../models/SiteSettings.model.js";
import { audit } from "../services/audit.service.js";

const defaults = {
  siteTitle: "Eduardo Tebar Boti | Metodologia Clinica",
  heroTitle: "Metodologia clinica aplicada para investigacion rigurosa",
  heroSubtitle: "Alineo pregunta, diseno, estimando, datos, modelo estadistico, supuestos, interpretacion y reporte.",
  aboutText: "Eduardo Tebar Boti es medico especializado en metodologia clinica aplicada, causalidad, prediccion, reporte cientifico y apoyo a investigadores clinicos.",
  contactEmail: "contacto@eduardotebarboti.com",
  accentColor: "#38bdf8"
};

export async function getSettings(_req: Request, res: Response) {
  const settings = await SiteSettings.findOne().sort({ updatedAt: -1 });
  res.json(settings ?? defaults);
}

export async function updateSettings(req: Request, res: Response) {
  const current = await SiteSettings.findOne().sort({ updatedAt: -1 });
  const settings = current
    ? await SiteSettings.findByIdAndUpdate(current._id, req.body, { new: true, runValidators: true })
    : await SiteSettings.create(req.body);
  await audit(req, "update", "settings", String(settings?._id));
  res.json(settings);
}
