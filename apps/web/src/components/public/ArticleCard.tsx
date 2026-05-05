import type { Post } from "@doctor-tebar/shared";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../common/Badge";

export function ArticleCard({ post }: { post: Pick<Post, "title" | "excerpt" | "slug" | "category" | "publishedAt" | "tags"> }) {
  return (
    <article className="content-card">
      <Badge>{post.category}</Badge>
      <h3>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <div className="card-meta">
        <CalendarDays size={16} />
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-ES") : "Sin fecha"}
      </div>
    </article>
  );
}
