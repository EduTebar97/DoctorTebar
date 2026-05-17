import { z } from "zod";

export const trainingChatSchema = z.object({
  topicId: z.string().optional(),
  message: z.string().min(10, "Escribe una pregunta un poco mas detallada").max(2000),
  consent: z.boolean().refine(Boolean, "Acepta el contacto para poder responderte")
});

export type TrainingChatFormData = z.infer<typeof trainingChatSchema>;
