import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { trainingChatSchema, type TrainingChatFormData } from "../../schemas/training-chat.schema";
import { createTrainingChatMessage } from "../../services/contentService";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";

export function TrainingChatForm({ slug, topics = [] }: { slug: string; topics?: { _id?: string; title: string }[] }) {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<TrainingChatFormData>({
    resolver: zodResolver(trainingChatSchema),
    defaultValues: { consent: false, topicId: "" }
  });

  async function onSubmit(values: TrainingChatFormData) {
    console.info("[CHAT] Enviando mensaje", { slug, topicId: values.topicId || null });
    try {
      await createTrainingChatMessage(slug, values);
      console.info("[CHAT] Mensaje enviado correctamente", { slug });
      setSent(true);
      reset();
    } catch (error: any) {
      console.error("[CHAT] Error enviando mensaje", error?.response?.data ?? error?.message ?? error);
    }
  }

  return (
    <section className="training-chat">
      <div className="section-heading">
        <div>
          <span className="badge"><MessageCircle size={14} /> Preguntas</span>
          <h2>Pregunta sobre esta formacion</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        {sent ? <div className="success-box">Pregunta registrada. Te responderemos por email.</div> : null}
        <label className="span-2">Tema<select {...register("topicId")}><option value="">Curso completo</option>{topics.map((topic) => <option key={topic._id ?? topic.title} value={topic._id ?? ""}>{topic.title}</option>)}</select></label>
        <label className="span-2">Mensaje<textarea rows={5} {...register("message")} /></label>
        <ErrorMessage message={formState.errors.message?.message} />
        <label className="checkbox span-2"><input type="checkbox" {...register("consent")} /> Acepto que se contacte conmigo para responder a esta pregunta.</label>
        <ErrorMessage message={formState.errors.consent?.message} />
        <Button type="submit" disabled={formState.isSubmitting}><Send size={18} /> Enviar pregunta</Button>
      </form>
    </section>
  );
}
