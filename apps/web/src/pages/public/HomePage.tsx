import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, FlaskConical, Lock, Microscope, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../../components/public/ArticleCard";
import { getPosts, getTrainingCourses } from "../../services/contentService";

export function HomePage() {
  const posts = useQuery({ queryKey: ["posts", "home"], queryFn: () => getPosts() });
  const training = useQuery({ queryKey: ["training", "home"], queryFn: getTrainingCourses });

  return (
    <>
      {/* Hero with profile */}
      <section className="hero hero-profile">
        <div className="hero-copy">
          <span className="eyebrow">Metodología clínica aplicada</span>
          <h1>Eduardo Tebar Botí</h1>
          <p className="hero-lead">
            Investigación clínica rigurosa alineando pregunta, diseño, estimando, datos, modelo estadístico,
            supuestos, interpretación y reporte.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/contacto">
              <Stethoscope size={18} /> Solicitar asesoría
            </Link>
            <Link className="btn secondary" to="/blog">
              Ver artículos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-profile-col">
          <div className="profile-photo-wrap">
            <img src="/perfil.jpeg" alt="Eduardo Tebar Botí" className="profile-photo" />
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div><span>Causalidad clínica</span><small>Estimandos, DAGs, target trial</small></div>
            <div><span>Predicción</span><small>Validación, calibración, utilidad</small></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Servicios</span>
            <h2>¿En qué puedo ayudarte?</h2>
          </div>
        </div>
        <div className="pillar-grid">
          <div>
            <FlaskConical size={24} />
            <span>Diseño de estudios</span>
            <small>Estudios observacionales, intervencionales, diseños con estimandos bien definidos y control del sesgo.</small>
          </div>
          <div>
            <Microscope size={24} />
            <span>Análisis estadístico</span>
            <small>Modelos causales y predictivos, propensity score, G-methods, análisis de sensibilidad y validación.</small>
          </div>
          <div>
            <BookOpen size={24} />
            <span>Reporte científico</span>
            <small>Redacción y revisión de artículos con guías STROBE, TRIPOD, PRISMA. Análisis auditables y reproducibles.</small>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link className="btn secondary" to="/contacto">Solicitar información <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Blog */}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Conocimiento</span>
            <h2>Últimos artículos</h2>
          </div>
          <Link className="btn secondary" to="/blog">Ver blog <ArrowRight size={16} /></Link>
        </div>
        <div className="card-grid">
          {posts.data?.slice(0, 3).map((post) => <ArticleCard key={post._id} post={post} />)}
        </div>
      </section>

      {/* Training */}
      <section className="section home-training-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Formación</span>
            <h2>Para personas que aman la ciencia</h2>
          </div>
          <Link className="btn secondary" to="/formacion">Ver formación <ArrowRight size={16} /></Link>
        </div>
        <div className="home-training-grid">
          <div className="home-training-text">
            <p>
              Accede a recursos formativos diseñados para <strong>profesionales sanitarios, investigadores</strong> y
              lectores interesados en comprender mejor la metodología clínica, la investigación biomédica y el
              razonamiento científico.
            </p>
            <p>
              Aprende a construir estudios defendibles, interpretar resultados con rigor y comunicar ciencia de forma
              clara y trazable.
            </p>
            <div className="home-training-access">
              <Lock size={16} />
              <span>Algunos contenidos formativos pueden requerir iniciar sesión.</span>
            </div>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn" to="/formacion">Explorar formación</Link>
              <Link className="btn secondary" to="/acceso">Iniciar sesión</Link>
            </div>
          </div>
          <div className="home-training-cards">
            {training.data?.slice(0, 2).map((item) => (
              <article className="content-card compact-card" key={item._id}>
                <div className="compact-card-body">
                  <h3><Link to={`/formacion/${item.slug}`}>{item.title}</Link></h3>
                  <div className="compact-card-footer">
                    <span className="card-meta">
                      <BookOpen size={13} /> {item.blocks?.length ?? 0} bloque{item.blocks?.length !== 1 ? "s" : ""}
                    </span>
                    <Link className="btn secondary compact-desc-btn" to={`/formacion/${item.slug}`}>
                      Ver <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
