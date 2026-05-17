import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImageUp, Save, Send } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { NewsItem, Post } from "@doctor-tebar/shared";
import { postFormSchema, type PostFormData } from "../../schemas/post.schema";
import { adminCreate, adminGet, adminUpdate, uploadMedia } from "../../services/contentService";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";
import { RichTextEditor } from "./RichTextEditor";

function score(values: Partial<PostFormData>) {
  const checks = [
    values.title && values.title.length >= 5,
    values.excerpt && values.excerpt.length >= 20,
    values.content && values.content.length >= 20,
    values.category,
    values.tags,
    values.coverImageUrl,
    values.seoTitle,
    values.seoDescription,
      values.status
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function PostEditorForm({ type = "posts" }: { type?: "posts" | "news" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["admin", type, id],
    queryFn: () => adminGet<Post | NewsItem>(type, id!),
    enabled: Boolean(id)
  });
  const { register, handleSubmit, control, setValue, reset, watch, formState } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { category: "general", status: "published", content: "", excerpt: "", featured: false }
  });
  const values = watch();
  const quality = score(values);
  const imageUpload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (asset) => {
      console.info("[BLOG] Imagen subida correctamente", { urlPresent: Boolean(asset.url) });
      setValue("coverImageUrl", asset.url, { shouldDirty: true, shouldValidate: true });
    },
    onError: (error: any) => console.error("[BLOG] Error subiendo imagen", error?.response?.data ?? error?.message ?? error)
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
    console.info("[BLOG] Intentando crear blog", { editing: Boolean(id) });
    const payload = { ...values, tags: values.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [] };
    console.info("[BLOG] Payload preparado para crear blog", {
      titlePresent: Boolean(payload.title),
      contentPresent: Boolean(payload.content),
      imagesAttached: payload.coverImageUrl ? 1 : 0
    });
    try {
      console.info("[BLOG] Enviando POST /api/admin/posts");
      if (id) await adminUpdate(type, id, payload);
      else await adminCreate(type, payload);
      console.info("[BLOG] Blog creado correctamente");
      navigate(`/admin/${type}`);
    } catch (error: any) {
      if (error?.response?.status === 401) console.warn("[BLOG] Error 401 al crear blog");
      console.error("[BLOG] Error creando blog", error?.response?.data ?? error?.message ?? error);
    }
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit(save)}>
      <div className="span-2 editor-inspector compact">
        <div>
          <span className="badge">Estado del post</span>
          <h2>{quality}% completo</h2>
          <div className="metric-line"><span style={{ width: `${quality}%` }} /></div>
        </div>
        <label>Estado<select {...register("status")}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
      </div>
      <label>Titulo<input data-tour="post-title" {...register("title")} /></label>
      <label>Extracto opcional<textarea data-tour="post-excerpt" rows={3} {...register("excerpt")} placeholder="Se genera automaticamente si lo dejas vacio" /></label>
      <label>Categoria<select data-tour="post-category" {...register("category")}><option value="causalidad">Causalidad</option><option value="prediccion">Prediccion</option><option value="reporte">Reporte</option><option value="stata">STATA</option><option value="errores">Errores</option><option value="general">General</option></select></label>
      <div className="post-image-field">
        <label>Imagen destacada<input data-tour="post-cover-image" {...register("coverImageUrl")} placeholder="https://..." /></label>
        <label className="upload-inline">
          <span>Subir imagen</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                console.info("[BLOG] Imagen seleccionada", { type: file.type, size: file.size });
                console.info("[BLOG] Subiendo imagen");
                imageUpload.mutate(file);
              }
              event.target.value = "";
            }}
          />
        </label>
        {imageUpload.isPending ? <p className="field-note">Subiendo imagen...</p> : null}
        {imageUpload.isError ? <ErrorMessage message="No se ha podido subir la imagen. Revisa Cloudinary y la sesion admin." /> : null}
        {values.coverImageUrl ? <img className="post-image-preview" src={values.coverImageUrl} alt="Vista previa de imagen destacada" /> : null}
      </div>
      <label>Tags<input data-tour="post-tags" {...register("tags")} placeholder="causalidad, DAG, IPTW" /></label>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <label className="span-2" data-tour="rich-editor">
            Contenido
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              onUploadImage={async (file) => {
                const asset = await uploadMedia(file);
                return asset.url;
              }}
            />
          </label>
        )}
      />
      <label data-tour="post-seo">SEO title<input {...register("seoTitle")} /></label>
      <label>SEO description<input {...register("seoDescription")} /></label>
      <div className="form-actions span-2">
        <Button type="submit" data-tour="post-save-draft" disabled={formState.isSubmitting || imageUpload.isPending}><Save size={18} /> Guardar y publicar</Button>
        <Button type="button" data-tour="post-publish" disabled={formState.isSubmitting || imageUpload.isPending} onClick={() => { setValue("status", "published"); void handleSubmit(save)(); }}><Send size={18} /> Publicar</Button>
        <Button type="button" className="secondary" onClick={() => document.querySelector<HTMLInputElement>(".upload-inline input")?.click()} disabled={imageUpload.isPending}><ImageUp size={18} /> Subir imagen</Button>
      </div>
    </form>
  );
}
