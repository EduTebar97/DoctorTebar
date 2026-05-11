import { useQueries } from "@tanstack/react-query";
import { CalendarDays, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { adminList } from "../../services/contentService";
import { buildLinkedInDraft, contentCompleteness, formatDate } from "./adminUtils";

const columns = [
  { key: "draft", label: "Borrador" },
  { key: "published", label: "Publicado" },
  { key: "archived", label: "Archivado" }
];

export function AdminEditorialPage() {
  const [posts, news, resources, services] = useQueries({
    queries: [
      { queryKey: ["admin", "posts"], queryFn: () => adminList<any>("posts") },
      { queryKey: ["admin", "news"], queryFn: () => adminList<any>("news") },
      { queryKey: ["admin", "resources"], queryFn: () => adminList<any>("resources") },
      { queryKey: ["admin", "services"], queryFn: () => adminList<any>("services") }
    ]
  });
  const items = [
    ...(posts.data ?? []).map((item) => ({ ...item, entity: "Post", editBase: "/admin/posts", publicPath: item.slug ? `/blog/${item.slug}` : undefined })),
    ...(news.data ?? []).map((item) => ({ ...item, entity: "Noticia", editBase: "/admin/news", publicPath: item.slug ? `/noticias/${item.slug}` : undefined })),
    ...(resources.data ?? []).map((item) => ({ ...item, entity: "Recurso", editBase: "/admin/resources" })),
    ...(services.data ?? []).map((item) => ({ ...item, entity: "Servicio", editBase: "/admin/services" }))
  ];

  async function copyDistribution(item: any) {
    await navigator.clipboard?.writeText(buildLinkedInDraft(item.title, item.excerpt ?? item.description ?? item.shortDescription, item.slug));
  }

  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Centro editorial</h1>
          <p>Pipeline de contenidos, calidad editorial, distribucion LinkedIn manual y huecos de publicacion.</p>
        </div>
        <Link className="btn" to="/admin/calendar"><CalendarDays size={18} /> Calendario</Link>
      </div>
      <div className="kanban-board">
        {columns.map((column) => (
          <section className="kanban-column" key={column.key}>
            <h2>{column.label}</h2>
            {items.filter((item) => item.status === column.key).map((item) => (
              <article className="kanban-card" key={`${item.entity}-${item._id}`}>
                <span className="badge">{item.entity}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt ?? item.description ?? item.shortDescription}</p>
                <div className="metric-line"><span style={{ width: `${contentCompleteness(item)}%` }} /></div>
                <small>Completitud {contentCompleteness(item)}% · {formatDate(item.updatedAt)}</small>
                <div className="toolbar">
                  <Link className="btn secondary" to={`${item.editBase}/${item._id}/edit`}>Editar</Link>
                  <Button type="button" className="secondary" onClick={() => copyDistribution(item)}><Copy size={16} /> LinkedIn</Button>
                  {item.publicPath ? <Link className="icon-btn" to={item.publicPath}><ExternalLink size={16} /></Link> : null}
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
