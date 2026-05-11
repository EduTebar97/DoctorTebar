import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminList } from "../../services/contentService";
import { formatDate } from "./adminUtils";

export function AdminCalendarPage() {
  const [posts, news, resources] = useQueries({
    queries: [
      { queryKey: ["admin", "posts"], queryFn: () => adminList<any>("posts") },
      { queryKey: ["admin", "news"], queryFn: () => adminList<any>("news") },
      { queryKey: ["admin", "resources"], queryFn: () => adminList<any>("resources") }
    ]
  });
  const items = [
    ...(posts.data ?? []).map((item) => ({ ...item, entity: "Post", editBase: "/admin/posts" })),
    ...(news.data ?? []).map((item) => ({ ...item, entity: "Noticia", editBase: "/admin/news" })),
    ...(resources.data ?? []).map((item) => ({ ...item, entity: "Recurso", editBase: "/admin/resources" }))
  ].sort((a, b) => String(b.publishedAt ?? b.updatedAt).localeCompare(String(a.publishedAt ?? a.updatedAt)));

  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Calendario editorial</h1>
          <p>Vista temporal de publicaciones, revisiones y huecos editoriales.</p>
        </div>
      </div>
      <div className="timeline-list">
        {items.map((item) => (
          <article className="admin-panel timeline-item" key={`${item.entity}-${item._id}`}>
            <span className="badge">{item.entity}</span>
            <h3>{item.title}</h3>
            <p>{item.status} · Publicado: {formatDate(item.publishedAt)} · Actualizado: {formatDate(item.updatedAt)}</p>
            <Link className="btn secondary" to={`${item.editBase}/${item._id}/edit`}>Abrir editor</Link>
          </article>
        ))}
      </div>
    </>
  );
}
