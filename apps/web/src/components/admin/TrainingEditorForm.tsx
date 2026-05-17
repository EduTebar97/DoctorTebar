import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TrainingCourse } from "@doctor-tebar/shared";
import { ImageUp, Plus, Save, Send, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { trainingFormSchema, type TrainingFormData } from "../../schemas/training.schema";
import { adminCreate, adminGet, adminUpdate, uploadMedia } from "../../services/contentService";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";

export function TrainingEditorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["admin", "training", id],
    queryFn: () => adminGet<TrainingCourse>("training", id!),
    enabled: Boolean(id)
  });
  const { register, handleSubmit, reset, setValue, watch, control, formState } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: { level: "intermedio", access: "private", status: "draft", featured: false, topics: [] }
  });
  const topics = useFieldArray({ control, name: "topics" });
  const values = watch();
  const imageUpload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (asset) => setValue("coverImageUrl", asset.url, { shouldDirty: true, shouldValidate: true })
  });

  useEffect(() => {
    if (!data) return;
    reset({
      title: data.title,
      summary: data.summary,
      description: data.description,
      level: data.level,
      access: data.access,
      coverImageUrl: data.coverImageUrl ?? "",
      price: data.price ?? "",
      duration: data.duration ?? "",
      topics: data.topics?.map((topic, index) => ({
        title: topic.title,
        summary: topic.summary ?? "",
        content: topic.content ?? "",
        imageUrls: topic.imageUrls ?? [],
        videoUrl: topic.videoUrl ?? "",
        order: topic.order ?? index
      })) ?? [],
      status: data.status,
      featured: data.featured
    });
  }, [data, reset]);

  async function save(values: TrainingFormData) {
    if (id) await adminUpdate("training", id, values);
    else await adminCreate("training", values);
    navigate("/admin/training");
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit(save)}>
      <label>Titulo<input {...register("title")} /></label>
      <label>Nivel<select {...register("level")}><option value="introductorio">Introductorio</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></label>
      <label className="span-2">Resumen<textarea rows={3} {...register("summary")} /></label>
      <label className="span-2">Descripcion<textarea rows={8} {...register("description")} /></label>
      <label>Acceso<select {...register("access")}><option value="private">Privado</option><option value="public">Publico</option></select></label>
      <label>Estado<select {...register("status")}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
      <label>Duracion<input {...register("duration")} placeholder="4 semanas" /></label>
      <label>Precio<input {...register("price")} placeholder="Consultar" /></label>
      <label className="checkbox span-2"><input type="checkbox" {...register("featured")} /> Destacar esta formacion</label>
      <div className="post-image-field span-2">
        <label>Imagen destacada<input {...register("coverImageUrl")} placeholder="https://..." /></label>
        <label className="upload-inline">
          <span>Subir imagen</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) imageUpload.mutate(file);
              event.target.value = "";
            }}
          />
        </label>
        {imageUpload.isPending ? <p className="field-note">Subiendo imagen...</p> : null}
        {imageUpload.isError ? <ErrorMessage message="No se ha podido subir la imagen." /> : null}
        {values.coverImageUrl ? <img className="post-image-preview" src={values.coverImageUrl} alt="Vista previa de formacion" /> : null}
      </div>
      <div className="span-2 admin-panel training-topics">
        <div className="section-heading">
          <h2>Indice y temas</h2>
          <Button type="button" className="secondary" onClick={() => topics.append({ title: "Nuevo tema", summary: "", content: "", imageUrls: [], videoUrl: "", order: topics.fields.length })}><Plus size={18} /> Tema</Button>
        </div>
        {topics.fields.map((topic, index) => (
          <div className="topic-editor" key={topic.id}>
            <div className="section-heading">
              <h3>Tema {index + 1}</h3>
              <Button type="button" className="danger icon-only" onClick={() => topics.remove(index)}><Trash2 size={16} /></Button>
            </div>
            <label>Titulo<input {...register(`topics.${index}.title`)} /></label>
            <label>Orden<input type="number" {...register(`topics.${index}.order`)} /></label>
            <label className="span-2">Descripcion breve<textarea rows={2} {...register(`topics.${index}.summary`)} /></label>
            <label className="span-2">Texto largo<textarea rows={7} {...register(`topics.${index}.content`)} /></label>
            <label>Video opcional<input {...register(`topics.${index}.videoUrl`)} placeholder="https://..." /></label>
            <label>Imagenes del tema<input {...register(`topics.${index}.imageUrls`)} placeholder="https://imagen-1, https://imagen-2" /></label>
          </div>
        ))}
        {!topics.fields.length ? <p className="field-note">Anade temas para construir el indice de la formacion.</p> : null}
      </div>
      <div className="form-actions span-2">
        <Button type="submit" disabled={formState.isSubmitting || imageUpload.isPending}><Save size={18} /> Guardar</Button>
        <Button type="button" disabled={formState.isSubmitting || imageUpload.isPending} onClick={() => { setValue("status", "published"); void handleSubmit(save)(); }}><Send size={18} /> Publicar</Button>
        <Button type="button" className="secondary" disabled={imageUpload.isPending} onClick={() => document.querySelector<HTMLInputElement>(".upload-inline input")?.click()}><ImageUp size={18} /> Subir imagen</Button>
      </div>
    </form>
  );
}
