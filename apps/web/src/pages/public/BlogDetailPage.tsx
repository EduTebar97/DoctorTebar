import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Lightbox } from "../../components/common/Lightbox";
import { Loader } from "../../components/common/Loader";
import { getPost, getPosts } from "../../services/contentService";
import { renderMathInContainer } from "../../utils/renderMath";

export function BlogDetailPage() {
  const { slug = "" } = useParams();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const post = useQuery({ queryKey: ["post", slug], queryFn: () => getPost(slug) });

  useEffect(() => {
    renderMathInContainer(contentRef.current);
  }, [post.data]);
  const related = useQuery({ queryKey: ["related", slug], queryFn: () => getPosts() });
  if (post.isLoading) return <Loader />;
  if (post.isError) return <section className="section"><ErrorMessage message="No se ha podido cargar el articulo." /></section>;
  if (!post.data) return <section className="section"><h1>Articulo no encontrado</h1></section>;
  return (
    <article className="section article-page">
      {lightbox ? <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} /> : null}
      <Badge>{post.data.category}</Badge>
      <h1>{post.data.title}</h1>
      {post.data.coverImageUrl ? (
        <img
          className="article-cover"
          src={post.data.coverImageUrl}
          alt={post.data.title}
          onClick={() => setLightbox({ src: post.data!.coverImageUrl!, alt: post.data!.title })}
        />
      ) : null}
      {(post.data.thesis || post.data.excerpt) ? (
        <div className="article-description-block">
          <span className="article-description-label">Resumen</span>
          <p>{post.data.thesis || post.data.excerpt}</p>
        </div>
      ) : null}
      <div
        ref={contentRef}
        className="article-html"
        dangerouslySetInnerHTML={{ __html: post.data.content }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === "IMG") {
            const img = target as HTMLImageElement;
            setLightbox({ src: img.src, alt: img.alt || post.data!.title });
          }
        }}
      />
      <div className="tag-row">{post.data.tags?.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}</div>
      <div className="cta-band"><strong>Necesitas revisar un analisis o protocolo?</strong><Link className="btn" to="/contacto">Solicitar asesoria</Link></div>
      <h2>Articulos relacionados</h2>
      <div className="related-list">{related.data?.filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link key={item._id} to={`/blog/${item.slug}`}>{item.title}</Link>)}</div>
    </article>
  );
}
