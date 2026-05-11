import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { ClinicalService } from "@doctor-tebar/shared";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { serviceFormSchema, type ServiceFormData } from "../../schemas/service.schema";
import { adminCreate, adminGet, adminUpdate } from "../../services/contentService";
import { Button } from "../common/Button";

export function ServiceEditorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["admin", "services", id], queryFn: () => adminGet<ClinicalService>("services", id!), enabled: Boolean(id) });
  const { register, handleSubmit, reset, formState } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: { status: "draft", order: 0 }
  });

  useEffect(() => {
    if (!data) return;
    reset({ ...data, deliverables: data.deliverables.join("\n") });
  }, [data, reset]);

  async function save(values: ServiceFormData) {
    const payload = { ...values, deliverables: values.deliverables?.split("\n").map((item) => item.trim()).filter(Boolean) ?? [] };
    if (id) await adminUpdate("services", id, payload);
    else await adminCreate("services", payload);
    navigate("/admin/services");
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit(save)}>
      <label>Titulo<input data-tour="service-title" {...register("title")} /></label>
      <label>Orden<input type="number" {...register("order")} /></label>
      <label className="span-2">Descripcion breve<textarea data-tour="service-short-description" rows={3} {...register("shortDescription")} /></label>
      <label className="span-2">Descripcion completa<textarea data-tour="service-full-description" rows={6} {...register("fullDescription")} /></label>
      <label className="span-2">Audiencia objetivo<input data-tour="service-target-audience" {...register("targetAudience")} /></label>
      <label className="span-2">Entregables<textarea data-tour="service-deliverables" rows={5} {...register("deliverables")} placeholder="Un entregable por linea" /></label>
      <label>Estado<select {...register("status")}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
      <Button type="submit" disabled={formState.isSubmitting}>Guardar servicio</Button>
    </form>
  );
}
