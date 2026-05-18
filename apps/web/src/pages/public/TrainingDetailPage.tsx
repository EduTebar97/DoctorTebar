import { useQuery } from "@tanstack/react-query";
import { Clock, Lock, Unlock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Loader } from "../../components/common/Loader";
import { TrainingChatForm } from "../../components/public/TrainingChatForm";
import { useAuth } from "../../hooks/useAuth";
import { getTrainingCourse } from "../../services/contentService";

export function TrainingDetailPage() {
  const { slug = "" } = useParams();
  const course = useQuery({ queryKey: ["training", slug], queryFn: () => getTrainingCourse(slug), enabled: Boolean(slug) });
  const { user } = useAuth();

  if (course.isLoading) return <Loader />;
  if (course.isError) return <section className="section"><ErrorMessage message="No se ha podido cargar esta formacion." /></section>;
  if (!course.data) return <section className="section"><h1>Formacion no encontrada</h1></section>;
  const locked = Boolean((course.data as typeof course.data & { locked?: boolean }).locked);

  return (
    <article className="section article-page">
      <div className="tag-row">
        <Badge>{course.data.level}</Badge>
        <Badge>{course.data.access === "private" ? "Acceso privado" : "Acceso publico"}</Badge>
      </div>
      <h1>{course.data.title}</h1>
      <p className="lead">{course.data.summary}</p>
      <div className="training-meta-grid">
        <div>{course.data.access === "private" ? <Lock size={18} /> : <Unlock size={18} />}<span>{course.data.access === "private" ? "Requiere acceso" : "Acceso abierto"}</span></div>
        {course.data.duration ? <div><Clock size={18} /><span>{course.data.duration}</span></div> : null}
        {course.data.price ? <div><span>{course.data.price}</span></div> : null}
      </div>
      {course.data.coverImageUrl ? <img className="article-cover" src={course.data.coverImageUrl} alt={course.data.title} /> : null}
      {course.data.topics?.length ? (
        <section className="training-index">
          <h2>Indice</h2>
          <div className="training-index-grid">
            {[...course.data.topics].sort((a, b) => a.order - b.order).map((topic, index) => (
              <a href={`#tema-${index + 1}`} key={topic._id ?? topic.title}>
                <span>{index + 1}</span>
                <strong>{topic.title}</strong>
                {topic.summary ? <small>{topic.summary}</small> : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}
      <div className="article-html">
        {course.data.description.split("\n").map((paragraph) => paragraph.trim() ? <p key={paragraph}>{paragraph}</p> : null)}
      </div>
      {locked ? (
        <section className="access-gate admin-panel">
          <Badge>Acceso privado</Badge>
          <h2>Contenido completo protegido</h2>
          <p>Para acceder al material, los vídeos y el chat de esta formación necesitas una cuenta. Es gratuita.</p>
          <div className="form-actions">
            <Link className="btn" to={`/acceso?redirect=/formacion/${course.data.slug}`}>Iniciar sesion</Link>
            <Link className="btn secondary" to={`/acceso?tab=register&redirect=/formacion/${course.data.slug}`}>Crear cuenta gratis</Link>
          </div>
        </section>
      ) : null}
      {course.data.topics?.length ? (
        <section className="training-sequence">
          <h2>Secuencia de aprendizaje</h2>
          {[...course.data.topics].sort((a, b) => a.order - b.order).map((topic, index) => (
            <article id={`tema-${index + 1}`} className="training-topic" key={topic._id ?? topic.title}>
              <Badge>Tema {index + 1}</Badge>
              <h3>{topic.title}</h3>
              {topic.summary ? <p>{topic.summary}</p> : null}
              {!locked ? topic.imageUrls?.map((url) => <img key={url} src={url} alt={topic.title} />) : null}
              {!locked && topic.videoUrl ? <a className="btn secondary" href={topic.videoUrl} target="_blank" rel="noreferrer">Ver video</a> : null}
              {!locked && topic.content ? <div className="article-html">{topic.content.split("\n").map((paragraph) => paragraph.trim() ? <p key={paragraph}>{paragraph}</p> : null)}</div> : null}
            </article>
          ))}
        </section>
      ) : null}
      <div className="cta-band">
        <strong>{course.data.access === "private" ? "Solicita acceso a esta formacion" : "Quieres adaptar esta formacion a tu equipo?"}</strong>
        <Link className="btn" to="/contacto">Contactar</Link>
      </div>
      {user && !locked ? <TrainingChatForm slug={course.data.slug} topics={course.data.topics} /> : null}
    </article>
  );
}
