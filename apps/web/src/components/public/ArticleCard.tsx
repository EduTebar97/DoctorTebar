import type { Post } from "@doctor-tebar/shared";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../common/Badge";

export function ArticleCard({ post }: { post: Pick<Post, "title" | "excerpt" | "thesis" | "slug" | "category" | "publishedAt" | "tags" | "coverImageUrl"> }) {
  return (
    <article className="content-card">
      {post.coverImageUrl ? <Link to={`/blog/${post.slug}`}><img className="content-card-cover" src={post.coverImageUrl} alt={post.title} /></Link> : null}
      <Badge>{post.category}</Badge>
      <h3>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.thesis ? <p className="article-thesis">{post.thesis}</p> : null}
      <div className="card-meta">
        <CalendarDays size={16} />
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-ES") : "Sin fecha"}
      </div>
    </article>
  );
}
