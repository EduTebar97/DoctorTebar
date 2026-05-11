import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/common/Button";
import { getSettings, updateSettings } from "../../services/contentService";

export function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data) setForm(data); }, [data]);
  const save = useMutation({ mutationFn: updateSettings, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }) });
  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(form);
  }
  return (
    <>
      <div className="admin-heading"><h1>Ajustes publicos</h1></div>
      <form className="editor-form" onSubmit={submit}>
        <label>Titulo del sitio<input data-tour="settings-site-title" value={form.siteTitle ?? ""} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} /></label>
        <label>Hero<input data-tour="settings-hero-title" value={form.heroTitle ?? ""} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} /></label>
        <label className="span-2">Subtitulo<textarea value={form.heroSubtitle ?? ""} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} /></label>
        <label className="span-2">Sobre mi<textarea data-tour="settings-about-text" rows={6} value={form.aboutText ?? ""} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} /></label>
        <label>Email de contacto<input value={form.contactEmail ?? ""} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></label>
        <label>Color acento<input value={form.accentColor ?? ""} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} /></label>
        <Button type="submit" data-tour="settings-save">Guardar ajustes</Button>
      </form>
    </>
  );
}
