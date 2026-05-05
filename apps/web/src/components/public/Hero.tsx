import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Metodologia clinica aplicada</span>
        <h1>Eduardo Tebarbotic</h1>
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
        <div>causalidad</div>
        <div>prediccion</div>
        <div>reporte</div>
        <div>reproducibilidad</div>
      </div>
    </section>
  );
}
