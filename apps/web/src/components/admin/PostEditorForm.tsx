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

const templates = {
  docente: `<h2>Problema clinico</h2><p></p><h2>Error habitual</h2><p></p><h2>Fundamento metodologico</h2><p></p><h2>Ejemplo clinico</h2><p></p><h2>Como analizarlo</h2><p></p><h2>Como interpretarlo</h2><p></p><h2>Como reportarlo</h2><p></p><h2>Bibliografia</h2><p></p>`,
  critica: `<h2>Frase habitual</h2><p></p><h2>Por que parece razonable</h2><p></p><h2>Que error contiene</h2><p></p><h2>Ejemplo clinico</h2><p></p><h2>Forma correcta de decirlo</h2><p></p><h2>Conclusion practica</h2><p></p>`,
  caso: `<h2>Escenario clinico</h2><p></p><h2>Pregunta de investigacion</h2><p></p><h2>Diseno correcto</h2><p></p><h2>Modelo incorrecto habitual</h2><p></p><h2>Modelo recomendado</h2><p></p><h2>Interpretacion</h2><p></p><h2>Limitaciones</h2><p></p>`,
  stata: `<h2>Objetivo clinico</h2><p></p><h2>Contexto metodologico</h2><p></p><h2>Supuestos</h2><p></p><h2>Sintaxis STATA</h2><pre><code></code></pre><h2>Interpretacion</h2><p></p><h2>Texto para manuscrito</h2><p></p>`
};

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
    values.content?.includes("Ejemplo"),
    values.content?.includes("Conclusion") || values.content?.includes("conclusion")
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
    defaultValues: { category: "general", status: "draft", content: "", featured: false }
  });
  const values = watch();
  const quality = score(values);

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
      <div className="span-2 editor-inspector">
        <div>
          <span className="badge">Calidad editorial</span>
          <h2>{quality}% listo para publicar</h2>
          <div className="metric-line"><span style={{ width: `${quality}%` }} /></div>
        </div>
        <label>Plantilla cientifica<select onChange={(event) => event.target.value && setValue("content", templates[event.target.value as keyof typeof templates])} defaultValue="">
          <option value="">Sin plantilla</option>
          <option value="docente">Articulo docente largo</option>
          <option value="critica">Nota critica breve</option>
          <option value="caso">Caso metodologico</option>
          <option value="stata">Entrada STATA</option>
        </select></label>
      </div>
      <label>Titulo<input data-tour="post-title" {...register("title")} /></label>
      <label>Extracto<textarea data-tour="post-excerpt" rows={3} {...register("excerpt")} /></label>
      <label>Categoria<select data-tour="post-category" {...register("category")}><option value="causalidad">Causalidad</option><option value="prediccion">Prediccion</option><option value="reporte">Reporte</option><option value="stata">STATA</option><option value="errores">Errores</option><option value="general">General</option></select></label>
      <label>Imagen destacada<input data-tour="post-cover-image" {...register("coverImageUrl")} /></label>
      <label>Tags<input data-tour="post-tags" {...register("tags")} placeholder="causalidad, DAG, IPTW" /></label>
      <Controller name="content" control={control} render={({ field }) => <label className="span-2" data-tour="rich-editor">Contenido<RichTextEditor value={field.value} onChange={field.onChange} /></label>} />
      <label data-tour="post-seo">SEO title<input {...register("seoTitle")} /></label>
      <label>SEO description<input {...register("seoDescription")} /></label>
      <div className="span-2 admin-panel" data-tour="post-editorial-checklist">
        <h2>Control metodologico y distribucion</h2>
        <div className="checklist-grid">
          {["Titulo claro", "Extracto completo", "Categoria asignada", "Tags", "Imagen destacada", "SEO title", "Meta description", "Ejemplo clinico", "Conclusion practica", "Revisar enlaces internos"].map((item) => <label className="checkbox" key={item}><input type="checkbox" readOnly checked={item === "Titulo claro" ? Boolean(values.title) : item === "Extracto completo" ? Boolean(values.excerpt) : item === "Categoria asignada" ? Boolean(values.category) : item === "Tags" ? Boolean(values.tags) : item === "Imagen destacada" ? Boolean(values.coverImageUrl) : item === "SEO title" ? Boolean(values.seoTitle) : item === "Meta description" ? Boolean(values.seoDescription) : item === "Ejemplo clinico" ? values.content?.includes("Ejemplo") : item === "Conclusion practica" ? Boolean(values.content?.toLowerCase().includes("conclusion")) : false} /> {item}</label>)}
        </div>
        <textarea readOnly rows={7} value={[
          values.title || "Titulo del articulo",
          "",
          values.excerpt || "Resumen para LinkedIn",
          "",
          "Lectura recomendada para alinear pregunta, diseno, estimando, analisis e interpretacion.",
          "",
          "#InvestigacionClinica #Bioestadistica #Metodologia #Causalidad"
        ].join("\n")} />
      </div>
      <div className="form-actions span-2">
        <Button type="submit" data-tour="post-save-draft" disabled={formState.isSubmitting}><Save size={18} /> Guardar borrador</Button>
        <Button type="button" data-tour="post-publish" onClick={() => { setValue("status", "published"); void handleSubmit(save)(); }}><Send size={18} /> Publicar</Button>
      </div>
    </form>
  );
}
