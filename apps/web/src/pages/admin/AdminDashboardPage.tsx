import { useQueries } from "@tanstack/react-query";
import { FileText, GraduationCap, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../../components/admin/StatCard";
import { adminList } from "../../services/contentService";

export function AdminDashboardPage() {
  const [posts, training] = useQueries({
    queries: [
      { queryKey: ["admin", "posts"], queryFn: () => adminList<any>("posts") },
      { queryKey: ["admin", "training"], queryFn: () => adminList<any>("training") }
    ]
  });
  return (
    <>
      <div className="admin-heading" data-tour="dashboard-home"><h1>Dashboard</h1><Link className="btn" to="/admin/posts/new">Nuevo post</Link></div>
      <div className="stats-grid" data-tour="dashboard-metrics">
        <StatCard label="Blog" value={posts.data?.length ?? 0} icon={<FileText />} />
        <StatCard label="Formacion" value={training.data?.length ?? 0} icon={<GraduationCap />} />
        <StatCard label="Chat" value="Sprint 9" icon={<MessageCircle />} />
      </div>
      <section className="admin-panel" data-tour="dashboard-quick-actions"><h2>Accesos rapidos</h2><div className="quick-links"><Link to="/admin/posts/new">Nuevo post</Link><Link to="/admin/training/new">Nueva formacion</Link><Link to="/admin/chat">Chat</Link></div></section>
    </>
  );
}
