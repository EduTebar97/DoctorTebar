import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Lightbox } from "../../components/common/Lightbox";
import { Loader } from "../../components/common/Loader";
import { TrainingChatForm } from "../../components/public/TrainingChatForm";
import { useAuth } from "../../hooks/useAuth";
import { getTrainingCourse } from "../../services/contentService";
import type { TrainingBlock, TrainingTopic } from "@doctor-tebar/shared";

export function TrainingDetailPage() {
  const { slug = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const course = useQuery({
    queryKey: ["training", slug],
    queryFn: () => getTrainingCourse(slug),
    enabled: Boolean(slug)
  });

  if (course.isLoading) return <Loader />;
  if (course.isError) return <section className="section"><ErrorMessage message="No se ha podido cargar esta formación." /></section>;
  if (!course.data) return <section className="section"><h1>Formación no encontrada</h1></section>;

  const locked = Boolean((course.data as any).locked);
  const blocks: TrainingBlock[] = [...(course.data.blocks ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Flat list of all topics for navigation
  const allTopics: Array<{ blockIndex: number; topicIndex: number; blockTitle: string; topic: TrainingTopic }> = [];
  blocks.forEach((block, bi) => {
    [...(block.topics ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).forEach((topic, ti) => {
      allTopics.push({ blockIndex: bi, topicIndex: ti, blockTitle: block.title, topic });
    });
  });

  const activeTopic = searchParams.get("tema");
  const activeTopicData = activeTopic
    ? allTopics.find((t) => t.topic._id === activeTopic || String(t.topicIndex) === activeTopic)
    : null;
  const activeTopicIndex = activeTopicData ? allTopics.indexOf(activeTopicData) : -1;

  function openTopic(topicId: string | undefined, idx: number) {
    if (!topicId) return;
    setSearchParams({ tema: topicId });
    document.getElementById("topic-content")?.scrollIntoView({ behavior: "smooth" });
  }

  // ── Topic content view ─────────────────────────────────────────────────────
  if (activeTopicData && !locked) {
    const topic = activeTopicData.topic;
    const prev = activeTopicIndex > 0 ? allTopics[activeTopicIndex - 1] : null;
    const next = activeTopicIndex < allTopics.length - 1 ? allTopics[activeTopicIndex + 1] : null;

    return (
      <article className="section article-page" id="topic-content">
        {lightbox ? <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} /> : null}
        <nav className="breadcrumb">
          <Link to={`/formacion/${course.data.slug}`}>← {course.data.title}</Link>
          <span> / {activeTopicData.blockTitle}</span>
        </nav>
        <Badge>Bloque {activeTopicData.blockIndex + 1} — {activeTopicData.blockTitle}</Badge>
        <h1>{topic.title}</h1>
        {topic.description ? <p className="lead">{topic.description}</p> : null}

        {topic.imageUrls?.length ? (
          <div className="topic-images">
            {topic.imageUrls.map((url: string) => (
              <img
                key={url}
                src={url}
                alt={topic.title}
                className="article-cover"
                onClick={() => setLightbox({ src: url, alt: topic.title })}
              />
            ))}
          </div>
        ) : null}

        {topic.videoUrl ? (
          <a className="btn secondary" href={topic.videoUrl} target="_blank" rel="noreferrer">
            Ver vídeo
          </a>
        ) : null}

        {topic.content ? (
          <div
            className="article-html"
            dangerouslySetInnerHTML={{ __html: topic.content }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === "IMG") {
                const img = target as HTMLImageElement;
                setLightbox({ src: img.src, alt: img.alt || topic.title });
              }
            }}
          />
        ) : null}

        {/* Navigation */}
        <div className="topic-nav">
          {prev ? (
            <button className="btn secondary" onClick={() => openTopic(prev.topic._id, activeTopicIndex - 1)}>
              <ArrowLeft size={16} /> Anterior: {prev.topic.title}
            </button>
          ) : <span />}
          <Link className="btn secondary" to={`/formacion/${course.data.slug}`}>
            Volver al índice
          </Link>
          {next ? (
            <button className="btn" onClick={() => openTopic(next.topic._id, activeTopicIndex + 1)}>
              Siguiente: {next.topic.title} <ArrowRight size={16} />
            </button>
          ) : <span />}
        </div>

        {user ? <TrainingChatForm slug={course.data.slug} blocks={blocks} currentBlockId={activeTopicData.topic._id ? undefined : undefined} currentTopicId={topic._id} /> : null}
      </article>
    );
  }

  // ── Course index view ──────────────────────────────────────────────────────
  return (
    <article className="section article-page">
      {lightbox ? <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} /> : null}
      <h1>{course.data.title}</h1>
      {course.data.coverImageUrl ? (
        <img
          className="article-cover"
          src={course.data.coverImageUrl}
          alt={course.data.title}
          onClick={() => setLightbox({ src: course.data!.coverImageUrl!, alt: course.data!.title })}
        />
      ) : null}
      {course.data.description ? (
        <div className="article-html">
          {course.data.description.split("\n").map((paragraph: string, i: number) =>
            paragraph.trim() ? <p key={i}>{paragraph}</p> : null
          )}
        </div>
      ) : null}

      {/* Locked gate */}
      {locked ? (
        <section className="access-gate admin-panel">
          <Lock size={24} />
          <h2>Contenido completo protegido</h2>
          <p>Para acceder al material, los vídeos y el chat de esta formación necesitas una cuenta. Es gratuita.</p>
          <div className="form-actions">
            <Link className="btn" to={`/acceso?redirect=/formacion/${course.data.slug}`}>Iniciar sesión</Link>
            <Link className="btn secondary" to={`/acceso?tab=register&redirect=/formacion/${course.data.slug}`}>Crear cuenta gratis</Link>
          </div>
        </section>
      ) : null}

      {/* Index: blocks and topics */}
      {blocks.length ? (
        <section className="training-index">
          <h2>Índice del curso</h2>
          {blocks.map((block, blockIndex) => {
            const sortedTopics = [...(block.topics ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            return (
              <div className="training-block-section" key={block._id ?? blockIndex}>
                <div className="block-heading">
                  <BookOpen size={18} />
                  <h3>Bloque {blockIndex + 1}: {block.title}</h3>
                </div>
                {block.description ? <p className="block-description">{block.description}</p> : null}
                <div className="training-index-grid">
                  {sortedTopics.map((topic, topicIndex) => {
                    const flat = allTopics.find((t) => t.topic._id === topic._id || (t.blockIndex === blockIndex && t.topicIndex === topicIndex));
                    const globalIndex = flat ? allTopics.indexOf(flat) : topicIndex;
                    return (
                      <div
                        key={topic._id ?? topic.title}
                        className={`training-topic-card${locked ? " locked" : ""}`}
                        onClick={() => !locked && openTopic(topic._id, globalIndex)}
                        role={!locked ? "button" : undefined}
                        tabIndex={!locked ? 0 : undefined}
                        onKeyDown={(e) => { if (!locked && (e.key === "Enter" || e.key === " ")) openTopic(topic._id, globalIndex); }}
                      >
                        <span className="topic-number">{globalIndex + 1}</span>
                        <div className="topic-info">
                          <strong>{topic.title}</strong>
                          {topic.description ? <small>{topic.description}</small> : null}
                        </div>
                        {locked ? <Lock size={14} /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      <div className="cta-band">
        <strong>¿Quieres adaptar esta formación a tu equipo?</strong>
        <Link className="btn" to="/contacto">Contactar</Link>
      </div>

      {user && !locked ? <TrainingChatForm slug={course.data.slug} blocks={blocks} /> : null}
    </article>
  );
}
