import { useQuery } from "@tanstack/react-query";
import { BookOpen, Star } from "lucide-react";
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
          <h1>Formación</h1>
          <p className="lead">
            Programas aplicados para investigadores clínicos que necesitan convertir preguntas reales en diseños,
            análisis e informes defendibles.
          </p>
        </div>
      </div>
      {isLoading ? <Loader /> : null}
      {isError ? <ErrorMessage message="No se ha podido cargar la formación." /> : null}
      {!isLoading && !isError && !data?.length ? (
        <EmptyState title="No hay formaciones publicadas" text="Vuelve a revisar esta sección próximamente." />
      ) : null}
      {data?.length ? (
        <div className="card-grid">
          {data.map((course) => {
            const numBlocks = course.blocks?.length ?? 0;
            const numTopics = (course.blocks ?? []).reduce(
              (sum, block) => sum + (block.topics?.length ?? 0), 0
            );
            return (
              <article className="content-card training-card" key={course._id}>
                {course.coverImageUrl ? (
                  <Link to={`/formacion/${course.slug}`}>
                    <img className="content-card-cover" src={course.coverImageUrl} alt={course.title} />
                  </Link>
                ) : null}
                {course.featured ? (
                  <div className="tag-row">
                    <Badge><Star size={12} /> Destacada</Badge>
                  </div>
                ) : null}
                <h3><Link to={`/formacion/${course.slug}`}>{course.title}</Link></h3>
                {course.description ? (
                  <p>{course.description.slice(0, 160)}{course.description.length > 160 ? "..." : ""}</p>
                ) : null}
                <div className="card-meta">
                  {numBlocks > 0 ? (
                    <span><BookOpen size={14} /> {numBlocks} bloque{numBlocks !== 1 ? "s" : ""}</span>
                  ) : null}
                  {numTopics > 0 ? (
                    <span>{numTopics} tema{numTopics !== 1 ? "s" : ""}</span>
                  ) : null}
                </div>
                <Link className="btn secondary" to={`/formacion/${course.slug}`}>Ver formación</Link>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
