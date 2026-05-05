import { useQuery } from "@tanstack/react-query";
import { Activity, BarChart3, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../../components/public/ArticleCard";
import { Hero } from "../../components/public/Hero";
import { getNews, getPosts, getServices } from "../../services/contentService";

export function HomePage() {
  const posts = useQuery({ queryKey: ["posts", "home"], queryFn: () => getPosts() });
  const news = useQuery({ queryKey: ["news", "home"], queryFn: getNews });
  const services = useQuery({ queryKey: ["services", "home"], queryFn: getServices });

  return (
    <>
      <Hero />
      <section className="section">
        <p className="thesis">La investigacion clinica rigurosa exige alinear pregunta, diseno, estimando, datos, modelo estadistico, supuestos, interpretacion y reporte.</p>
        <div className="pillar-grid">
          <div><Activity /><h3>Causalidad clinica aplicada</h3><p>Target trial emulation, DAGs, propensity score, IPTW y sesgos temporales.</p></div>
          <div><BarChart3 /><h3>Prediccion y pronostico</h3><p>Validacion, calibracion, Brier score, decision curves y TRIPOD+AI.</p></div>
          <div><FileCheck /><h3>Reporte reproducible</h3><p>STROBE, CONSORT, PRISMA, RECORD, plantillas y respuesta a revisores.</p></div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading"><h2>Ultimos articulos</h2><Link to="/blog">Ver blog</Link></div>
        <div className="card-grid">{posts.data?.slice(0, 3).map((post) => <ArticleCard key={post._id} post={post} />)}</div>
      </section>
      <section className="section split-list">
        <div><h2>Servicios destacados</h2>{services.data?.slice(0, 4).map((item) => <p key={item._id}><strong>{item.title}</strong><br />{item.shortDescription}</p>)}</div>
        <div><h2>Noticias</h2>{news.data?.slice(0, 3).map((item) => <p key={item._id}><Link to={`/noticias/${item.slug}`}>{item.title}</Link><br />{item.excerpt}</p>)}</div>
      </section>
    </>
  );
}
