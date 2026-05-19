import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { TrainingBlock } from "@doctor-tebar/shared";
import { trainingChatSchema, type TrainingChatFormData } from "../../schemas/training-chat.schema";
import { createTrainingChatMessage } from "../../services/contentService";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";

interface Props {
  slug: string;
  blocks?: TrainingBlock[];
  currentBlockId?: string;
  currentTopicId?: string;
}

export function TrainingChatForm({ slug, blocks = [], currentBlockId, currentTopicId }: Props) {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<TrainingChatFormData>({
    resolver: zodResolver(trainingChatSchema),
    defaultValues: { consent: false, topicId: currentTopicId ?? "", blockId: currentBlockId ?? "" }
  });

  async function onSubmit(values: TrainingChatFormData) {
    console.info("[CHAT] Enviando mensaje", { slug, blockId: values.blockId || null, topicId: values.topicId || null });
    try {
      await createTrainingChatMessage(slug, values);
      console.info("[CHAT] Mensaje enviado correctamente", { slug });
      setSent(true);
      reset();
    } catch (error: any) {
      console.error("[CHAT] Error enviando mensaje", error?.response?.data ?? error?.message ?? error);
    }
  }

  // Build flat topic list grouped by block
  const topicOptions: Array<{ value: string; label: string; blockId: string }> = [];
  blocks.forEach((block) => {
    (block.topics ?? []).forEach((topic) => {
      if (topic._id) topicOptions.push({ value: topic._id, label: `${block.title} / ${topic.title}`, blockId: block._id ?? "" });
    });
  });

  return (
    <section className="training-chat">
      <div className="section-heading">
        <div>
          <span className="badge"><MessageCircle size={14} /> Preguntas</span>
          <h2>Pregunta sobre esta formación</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        {sent ? <div className="success-box span-2">Pregunta registrada. Te responderemos por email.</div> : null}
        {topicOptions.length > 0 ? (
          <label className="span-2">
            Tema
            <select {...register("topicId")}>
              <option value="">Curso completo</option>
              {topicOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        ) : null}
        <input type="hidden" {...register("blockId")} />
        <label className="span-2">
          Mensaje
          <textarea rows={5} {...register("message")} placeholder="Escribe tu pregunta aquí..." />
        </label>
        <ErrorMessage message={formState.errors.message?.message} />
        <label className="checkbox span-2">
          <input type="checkbox" {...register("consent")} /> Acepto que se contacte conmigo para responder a esta pregunta.
        </label>
        <ErrorMessage message={formState.errors.consent?.message} />
        <Button type="submit" disabled={formState.isSubmitting}>
          <Send size={18} /> Enviar pregunta
        </Button>
      </form>
    </section>
  );
}
