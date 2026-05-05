import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { Resource } from "@doctor-tebar/shared";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { resourceFormSchema, type ResourceFormData } from "../../schemas/resource.schema";
import { adminCreate, adminGet, adminUpdate } from "../../services/contentService";
import { Button } from "../common/Button";

export function ResourceEditorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["admin", "resources", id], queryFn: () => adminGet<Resource>("resources", id!), enabled: Boolean(id) });
  const { register, handleSubmit, reset, formState } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: { type: "checklist", status: "draft" }
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function save(values: ResourceFormData) {
    if (id) await adminUpdate("resources", id, values);
    else await adminCreate("resources", values);
    navigate("/admin/resources");
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit(save)}>
      <label>Titulo<input {...register("title")} /></label>
      <label>Tipo<select {...register("type")}><option value="checklist">Checklist</option><option value="plantilla">Plantilla</option><option value="guia">Guia</option><option value="codigo">Codigo</option><option value="bibliografia">Bibliografia</option></select></label>
      <label className="span-2">Descripcion<textarea rows={5} {...register("description")} /></label>
      <label>URL archivo<input {...register("fileUrl")} /></label>
      <label>URL externa<input {...register("externalUrl")} /></label>
      <label>Estado<select {...register("status")}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
      <Button type="submit" disabled={formState.isSubmitting}>Guardar recurso</Button>
    </form>
  );
}
