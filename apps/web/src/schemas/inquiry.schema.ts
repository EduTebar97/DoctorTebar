import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Indica tu nombre"),
  email: z.string().email("Email no valido"),
  organization: z.string().optional(),
  projectStage: z.enum(["idea", "protocolo", "analisis", "manuscrito", "revision"]),
  objectiveType: z.enum(["causal", "predictivo", "descriptivo", "diagnostico", "pronostico", "mixto", "no_claro"]),
  message: z.string().min(20, "Describe brevemente el proyecto"),
  consent: z.boolean().refine(Boolean, "Debes aceptar el contacto")
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
