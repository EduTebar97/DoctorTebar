import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Save, Send } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { NewsItem, Post } from "@doctor-tebar/shared";
import { postFormSchema, type PostFormData } from "../../schemas/post.schema";
import { adminCreate, adminGet, adminUpdate } from "../../services/contentService";
import { Button } from "../common/Button";
import { RichTextEditor } from "./RichTextEditor";

export function PostEditorForm({ type = "posts" }: { type?: "posts" | "news" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["admin", type, id],
    queryFn: () => adminGet<Post | NewsItem>(type, id!),
    enabled: Boolean(id)
  });
  const { register, handleSubmit, control, setValue, reset, formState } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { category: "general", status: "draft", content: "", featured: false }
  });

  useEffect(() => {
    if (!data) return;
    reset({
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImageUrl: data.coverImageUrl ?? "",
      category: "category" in data ? data.category : "general",
      tags: "tags" in data ? data.tags.join(", ") : "",
      status: data.status,
      featured: data.featured,
      seoTitle: "seoTitle" in data ? data.seoTitle ?? "" : "",
      seoDescription: "seoDescription" in data ? data.seoDescription ?? "" : ""
    });
  }, [data, reset]);

  async function save(values: PostFormData) {
    const payload = { ...values, tags: values.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [] };
    if (id) await adminUpdate(type, id, payload);
    else await adminCreate(type, payload);
    navigate(`/admin/${type}`);
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit(save)}>
      <label>Titulo<input {...register("title")} /></label>
      <label>Extracto<textarea rows={3} {...register("excerpt")} /></label>
      <label>Categoria<select {...register("category")}><option value="causalidad">Causalidad</option><option value="prediccion">Prediccion</option><option value="reporte">Reporte</option><option value="stata">STATA</option><option value="errores">Errores</option><option value="general">General</option></select></label>
      <label>Imagen destacada<input {...register("coverImageUrl")} /></label>
      <label>Tags<input {...register("tags")} placeholder="causalidad, DAG, IPTW" /></label>
      <Controller name="content" control={control} render={({ field }) => <label className="span-2">Contenido<RichTextEditor value={field.value} onChange={field.onChange} /></label>} />
      <label>SEO title<input {...register("seoTitle")} /></label>
      <label>SEO description<input {...register("seoDescription")} /></label>
      <div className="form-actions span-2">
        <Button type="submit" disabled={formState.isSubmitting}><Save size={18} /> Guardar borrador</Button>
        <Button type="button" onClick={() => { setValue("status", "published"); void handleSubmit(save)(); }}><Send size={18} /> Publicar</Button>
      </div>
    </form>
  );
}
