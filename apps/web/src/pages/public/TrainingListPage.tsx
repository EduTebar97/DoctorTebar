import { useQuery } from "@tanstack/react-query";
import { Clock, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Loader } from "../../components/common/Loader";
import { getTrainingCourses } from "../../services/contentService";

export function TrainingListPage() {
  const { data, isError, isLoading } = useQuery({ queryKey: ["training"], queryFn: getTrainingCourses });

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <h1>Formacion</h1>
          <p className="lead">Programas aplicados para investigadores clinicos que necesitan convertir preguntas reales en disenos, analisis e informes defendibles.</p>
        </div>
      </div>
      {isLoading ? <Loader /> : null}
      {isError ? <ErrorMessage message="No se ha podido cargar la formacion." /> : null}
      {!isLoading && !isError && !data?.length ? <EmptyState title="No hay formaciones publicadas" text="Vuelve a revisar esta seccion proximamente." /> : null}
      {data?.length ? (
        <div className="card-grid">
          {data.map((course) => (
            <article className="content-card training-card" key={course._id}>
              {course.coverImageUrl ? <Link to={`/formacion/${course.slug}`}><img className="content-card-cover" src={course.coverImageUrl} alt={course.title} /></Link> : null}
              <div className="tag-row">
                <Badge>{course.level}</Badge>
                <Badge>{course.access === "private" ? "Privada" : "Publica"}</Badge>
              </div>
              <h3><Link to={`/formacion/${course.slug}`}>{course.title}</Link></h3>
              <p>{course.summary}</p>
              {course.topics?.length ? <p>{course.topics.length} temas en el indice</p> : null}
              <div className="card-meta">
                {course.duration ? <><Clock size={16} /> {course.duration}</> : null}
                {course.access === "private" ? <Lock size={16} /> : <Unlock size={16} />}
                {course.price || "Consultar"}
              </div>
              <Link className="btn secondary" to={`/formacion/${course.slug}`}>Ver formacion</Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
