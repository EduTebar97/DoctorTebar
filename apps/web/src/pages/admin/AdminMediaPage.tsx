import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Trash2, Upload } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "../../components/common/Button";
import { ConfirmDeleteModal } from "../../components/common/ConfirmDeleteModal";
import { apiClient } from "../../services/apiClient";

export function AdminMediaPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ _id: string; name: string } | null>(null);
  const { data } = useQuery({ queryKey: ["admin", "media"], queryFn: async () => (await apiClient.get<any[]>("/admin/media")).data });
  const upload = useMutation({
    mutationFn: async () => {
      const body = new FormData();
      if (!file) throw new Error("Selecciona un archivo");
      body.append("file", file);
      return apiClient.post("/admin/media/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    }
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) => apiClient.patch(`/admin/media/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] })
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/media/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] })
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    upload.mutate();
  }

  return (
    <>
      {pendingDelete ? (
        <ConfirmDeleteModal
          itemName={pendingDelete.name}
          onConfirm={() => { remove.mutate(pendingDelete._id); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
      <div className="admin-heading"><h1>Biblioteca de medios</h1></div>
      <form className="admin-panel media-upload" onSubmit={submit} data-tour="media-upload">
        <label>Subir archivo<input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
        <Button type="submit" disabled={!file || upload.isPending}><Upload size={18} /> Subir medio</Button>
        {upload.isError ? <p className="error-message">La subida requiere Cloudinary configurado en el backend.</p> : null}
      </form>
      <div className="media-grid" data-tour="media-grid">
        {data?.map((asset) => (
          <article className="content-card media-card" key={asset._id}>
            {asset.mimeType?.startsWith("image/") ? <img src={asset.url} alt={asset.altText || asset.originalName || "Medio"} /> : <div className="media-file">{asset.mimeType}</div>}
            <h3>{asset.originalName ?? asset.publicId}</h3>
            <p>{Math.round((asset.size ?? 0) / 1024)} KB · {asset.mimeType}</p>
            <label>Alt text<input defaultValue={asset.altText ?? ""} onBlur={(e) => update.mutate({ id: asset._id, payload: { altText: e.target.value, caption: asset.caption, credit: asset.credit } })} /></label>
            <label>Caption<input defaultValue={asset.caption ?? ""} onBlur={(e) => update.mutate({ id: asset._id, payload: { altText: asset.altText, caption: e.target.value, credit: asset.credit } })} /></label>
            <div className="toolbar">
              <Button type="button" className="secondary" data-tour="media-copy-url" onClick={() => navigator.clipboard?.writeText(asset.url)}><Copy size={16} /> URL</Button>
              <Button type="button" className="danger icon-only" onClick={() => setPendingDelete({ _id: asset._id, name: asset.originalName ?? asset.publicId ?? "archivo" })}><Trash2 size={16} /></Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
