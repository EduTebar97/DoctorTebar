import { useQueries } from "@tanstack/react-query";
import { FileText, Inbox, Newspaper, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../../components/admin/StatCard";
import { adminList } from "../../services/contentService";

export function AdminDashboardPage() {
  const [posts, news, inquiries, resources] = useQueries({
    queries: [
      { queryKey: ["admin", "posts"], queryFn: () => adminList<any>("posts") },
      { queryKey: ["admin", "news"], queryFn: () => adminList<any>("news") },
      { queryKey: ["admin", "inquiries"], queryFn: () => adminList<any>("inquiries") },
      { queryKey: ["admin", "resources"], queryFn: () => adminList<any>("resources") }
    ]
  });
  return (
    <>
      <div className="admin-heading"><h1>Dashboard</h1><Link className="btn" to="/admin/posts/new">Nuevo post</Link></div>
      <div className="stats-grid">
        <StatCard label="Posts" value={posts.data?.length ?? 0} icon={<FileText />} />
        <StatCard label="Noticias" value={news.data?.length ?? 0} icon={<Newspaper />} />
        <StatCard label="Consultas" value={inquiries.data?.length ?? 0} icon={<Inbox />} />
        <StatCard label="Recursos" value={resources.data?.length ?? 0} icon={<Wrench />} />
      </div>
      <section className="admin-panel"><h2>Accesos rapidos</h2><div className="quick-links"><Link to="/admin/posts/new">Nuevo post</Link><Link to="/admin/news/new">Nueva noticia</Link><Link to="/admin/inquiries">Revisar consultas</Link><Link to="/admin/settings">Ajustes publicos</Link></div></section>
    </>
  );
}
