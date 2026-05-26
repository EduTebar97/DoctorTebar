import type { Post } from "@doctor-tebar/shared";
import { CalendarDays, Info } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../common/Badge";
import { DescriptionModal } from "../common/DescriptionModal";

type CardPost = Pick<Post, "title" | "excerpt" | "thesis" | "slug" | "category" | "publishedAt" | "tags" | "coverImageUrl">;

export function ArticleCard({ post }: { post: CardPost }) {
  const [showDesc, setShowDesc] = useState(false);
  const description = post.thesis || post.excerpt || "";

  return (
    <>
      {showDesc && description ? (
        <DescriptionModal title={post.title} description={description} onClose={() => setShowDesc(false)} />
      ) : null}
      <article className="content-card compact-card">
        {post.coverImageUrl ? (
          <Link to={`/blog/${post.slug}`} className="card-cover-link">
            <img className="content-card-cover" src={post.coverImageUrl} alt={post.title} />
          </Link>
        ) : null}
        <div className="compact-card-body">
          <Badge>{post.category}</Badge>
          <h3>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <div className="compact-card-footer">
            <div className="card-meta">
              <CalendarDays size={14} />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-ES") : "Sin fecha"}
            </div>
            {description ? (
              <button
                className="btn secondary compact-desc-btn"
                type="button"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowDesc(true); }}
              >
                <Info size={13} /> Ver descripción
              </button>
            ) : null}
          </div>
        </div>
      </article>
    </>
  );
}
