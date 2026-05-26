import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import type { BlogCategory } from "@doctor-tebar/shared";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Loader } from "../../components/common/Loader";
import { ArticleCard } from "../../components/public/ArticleCard";
import { getCategories, getPosts } from "../../services/contentService";

const FALLBACK_CATEGORIES: BlogCategory[] = [
  { _id: "causalidad", name: "Causalidad", slug: "causalidad", color: "#16a34a", order: 0, createdAt: "", updatedAt: "" },
  { _id: "prediccion", name: "Predicción", slug: "prediccion", color: "#0284c7", order: 1, createdAt: "", updatedAt: "" },
  { _id: "reporte", name: "Reporte", slug: "reporte", color: "#7c3aed", order: 2, createdAt: "", updatedAt: "" },
  { _id: "stata", name: "STATA", slug: "stata", color: "#ea580c", order: 3, createdAt: "", updatedAt: "" },
];

export function BlogListPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const { data: cats = [] } = useQuery<BlogCategory[]>({
    queryKey: ["blog-categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000
  });

  const categories = cats.length > 0 ? cats : FALLBACK_CATEGORIES;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts", q, category],
    queryFn: () => getPosts({ ...(q ? { q } : {}), ...(category ? { category } : {}) })
  });

  return (
    <section className="section">
      <h1>Blog</h1>
      <div className="blog-filters">
        <div className="blog-search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar artículos..." />
        </div>
        <div className="blog-category-tabs">
          <button
            className={"category-tab" + (category === "" ? " active" : "")}
            onClick={() => setCategory("")}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              className={"category-tab" + (category === c.slug ? " active" : "")}
              style={category === c.slug ? { background: c.color, borderColor: c.color, color: "#fff" } : { borderColor: c.color, color: c.color }}
              onClick={() => setCategory(category === c.slug ? "" : c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? <Loader /> : null}
      {isError ? <ErrorMessage message="No se han podido cargar los artículos." /> : null}
      {!isLoading && !isError && !data?.length ? <EmptyState title="No hay artículos publicados" /> : null}
      {data?.length ? <div className="card-grid">{data.map((post) => <ArticleCard key={post._id} post={post} />)}</div> : null}
    </section>
  );
}
