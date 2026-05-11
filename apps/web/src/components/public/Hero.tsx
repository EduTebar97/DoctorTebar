import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Metodologia clinica aplicada</span>
        <h1>Eduardo Tebar Boti</h1>
        <p className="hero-lead">
          Investigacion clinica rigurosa alineando pregunta, diseno, estimando, datos, modelo estadistico, supuestos,
          interpretacion y reporte.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/contacto">
            <ClipboardCheck size={18} /> Solicitar asesoria
          </Link>
          <Link className="btn secondary" to="/blog">
            Ver articulos <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <div className="hero-panel" aria-hidden="true">
        <div><span>Causalidad clinica</span><small>Estimandos, DAGs, target trial</small></div>
        <div><span>Prediccion</span><small>Validacion, calibracion, utilidad</small></div>
        <div><span>Reporte cientifico</span><small>STROBE, TRIPOD, PRISMA</small></div>
        <div><span>Reproducibilidad</span><small>Analisis defendibles y auditables</small></div>
      </div>
    </section>
  );
}
