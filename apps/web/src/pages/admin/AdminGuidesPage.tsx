import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { guideDefinitions } from "../../guides/guideDefinitions";
import { useGuidedTour } from "../../components/guides/GuidedTourProvider";

const categoryLabels: Record<string, string> = {
  "getting-started": "Primeros pasos",
  blog: "Blog",
  news: "Noticias",
  resources: "Recursos",
  services: "Servicios",
  inquiries: "Consultas",
  seo: "SEO",
  linkedin: "LinkedIn",
  settings: "Configuracion",
  security: "Seguridad"
};

function getStatus(id: string) {
  return localStorage.getItem(`guide:${id}:status`) ?? "not_started";
}

export function AdminGuidesPage() {
  const { startGuide } = useGuidedTour();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener("guide-progress-changed", refresh);
    return () => window.removeEventListener("guide-progress-changed", refresh);
  }, []);

  const guides = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return guideDefinitions.filter((guide) => {
      const matchesText = !needle || `${guide.title} ${guide.description}`.toLowerCase().includes(needle);
      const matchesCategory = !category || guide.category === category;
      return matchesText && matchesCategory;
    });
  }, [q, category, version]);

  return (
    <>
      <div className="admin-heading" data-tour="guides-center">
        <div>
          <span className="badge">Centro de aprendizaje</span>
          <h1>Guia interactiva</h1>
          <p>Aprende a gestionar la plataforma paso a paso con recorridos guiados dentro del backoffice.</p>
        </div>
      </div>
      <div className="filters" data-tour="guides-filters">
        <Search size={18} />
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Buscar guias" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Todas las areas</option>
          {Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>
      <section className="guide-grid">
        {guides.map((guide) => {
          const status = getStatus(guide.id);
          const completed = status === "completed";
          return (
            <article className="content-card guide-card" key={guide.id} data-testid={`guide-card-${guide.id}`}>
              <div className="guide-card-head">
                <span className="badge">{categoryLabels[guide.category]}</span>
                <span>{guide.estimatedMinutes} min</span>
              </div>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <div className="metric-line"><span style={{ width: completed ? "100%" : status === "in_progress" ? "45%" : "0%" }} /></div>
              <div className="guide-meta">
                <span>{guide.difficulty}</span>
                <span>{completed ? "Completada" : status === "in_progress" ? "En progreso" : "No iniciada"}</span>
                <span>{guide.steps.length} pasos</span>
              </div>
              <div className="toolbar">
                <button className="btn" data-testid={`start-guide-${guide.id}`} onClick={() => startGuide(guide.id)}>
                  {completed ? "Repetir guia" : "Empezar guia"}
                </button>
                <button
                  className="btn secondary"
                  onClick={() => {
                    localStorage.setItem(`guide:${guide.id}:status`, "completed");
                    setVersion((value) => value + 1);
                  }}
                >
                  Marcar completada
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
