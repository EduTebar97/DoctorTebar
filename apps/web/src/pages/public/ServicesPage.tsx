import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { getServices } from "../../services/contentService";

const fallback = [
  ["Asesoria pre-protocolo", "Refinamiento de pregunta clinica, diseno, outcome, estimando, tamano muestral y plan de analisis."],
  ["Asesoria de analisis", "Limpieza de datos, modelos multivariables, supervivencia, propensity score, IPTW, imputacion multiple y bootstrap."],
  ["Asesoria pre-envio", "Revision de metodos, coherencia objetivo-metodos-resultados-conclusion y guias de reporte."],
  ["Respuesta a revisores", "Revision de comentarios estadisticos, respuestas tecnicas y reformulacion de analisis."]
];

export function ServicesPage() {
  const { data } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const items = data?.length ? data.map((item) => [item.title, item.shortDescription]) : fallback;
  return (
    <section className="section">
      <h1>Servicios</h1>
      <div className="card-grid">{items.map(([title, text]) => <article className="content-card" key={title}><h3>{title}</h3><p>{text}</p><Link to="/contacto">Solicitar asesoria</Link></article>)}</div>
      {!items.length ? <EmptyState title="Sin servicios publicados" /> : null}
    </section>
  );
}
