import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { Loader } from "../../components/common/Loader";
import { ArticleCard } from "../../components/public/ArticleCard";
import { getPosts } from "../../services/contentService";

export function BlogListPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts", q, category],
    queryFn: () => getPosts({ ...(q ? { q } : {}), ...(category ? { category } : {}) })
  });
  return (
    <section className="section">
      <h1>Blog</h1>
      <div className="filters"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar articulos" /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todas</option><option value="causalidad">Causalidad</option><option value="prediccion">Prediccion</option><option value="reporte">Reporte</option><option value="stata">STATA</option></select></div>
      {isLoading ? <Loader /> : null}
      {isError ? <ErrorMessage message="No se han podido cargar los articulos." /> : null}
      {!isLoading && !isError && !data?.length ? <EmptyState title="No hay articulos publicados" /> : null}
      {data?.length ? <div className="card-grid">{data.map((post) => <ArticleCard key={post._id} post={post} />)}</div> : null}
    </section>
  );
}
