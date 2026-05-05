import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { Loader } from "../../components/common/Loader";
import { getPost, getPosts } from "../../services/contentService";

export function BlogDetailPage() {
  const { slug = "" } = useParams();
  const post = useQuery({ queryKey: ["post", slug], queryFn: () => getPost(slug) });
  const related = useQuery({ queryKey: ["related", slug], queryFn: () => getPosts() });
  if (post.isLoading) return <Loader />;
  if (!post.data) return <section className="section"><h1>Articulo no encontrado</h1></section>;
  return (
    <article className="section article-page">
      <Badge>{post.data.category}</Badge>
      <h1>{post.data.title}</h1>
      <p className="lead">{post.data.excerpt}</p>
      <div className="article-html" dangerouslySetInnerHTML={{ __html: post.data.content }} />
      <div className="tag-row">{post.data.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
      <div className="cta-band"><strong>Necesitas revisar un analisis o protocolo?</strong><Link className="btn" to="/contacto">Solicitar asesoria</Link></div>
      <h2>Articulos relacionados</h2>
      <div className="related-list">{related.data?.filter((item) => item.slug !== slug).slice(0, 3).map((item) => <Link key={item._id} to={`/blog/${item.slug}`}>{item.title}</Link>)}</div>
    </article>
  );
}
