import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createInquiry } from "../../services/contentService";
import { inquirySchema, type InquiryFormData } from "../../schemas/inquiry.schema";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { projectStage: "protocolo", objectiveType: "causal", consent: false }
  });

  async function onSubmit(values: InquiryFormData) {
    await createInquiry(values);
    setSent(true);
    reset();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
      {sent ? <div className="success-box">Consulta registrada. Revisaremos el proyecto y responderemos por email.</div> : null}
      <label>Nombre<input {...register("name")} /></label>
      <ErrorMessage message={formState.errors.name?.message} />
      <label>Email<input type="email" {...register("email")} /></label>
      <ErrorMessage message={formState.errors.email?.message} />
      <label>Organizacion<input {...register("organization")} /></label>
      <label>Fase del proyecto<select {...register("projectStage")}><option value="idea">Idea</option><option value="protocolo">Protocolo</option><option value="analisis">Analisis</option><option value="manuscrito">Manuscrito</option><option value="revision">Revision</option></select></label>
      <label>Tipo de objetivo<select {...register("objectiveType")}><option value="causal">Causal</option><option value="predictivo">Predictivo</option><option value="descriptivo">Descriptivo</option><option value="diagnostico">Diagnostico</option><option value="pronostico">Pronostico</option><option value="mixto">Mixto</option><option value="no_claro">No claro</option></select></label>
      <label className="span-2">Mensaje<textarea rows={7} {...register("message")} /></label>
      <ErrorMessage message={formState.errors.message?.message} />
      <label className="checkbox span-2"><input type="checkbox" {...register("consent")} /> Acepto que se contacte conmigo para responder a esta consulta.</label>
      <ErrorMessage message={formState.errors.consent?.message} />
      <Button type="submit" disabled={formState.isSubmitting}><Send size={18} /> Enviar consulta</Button>
    </form>
  );
}
