import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArticleCard } from "../../components/public/ArticleCard";
import { Hero } from "../../components/public/Hero";
import { getPosts, getTrainingCourses } from "../../services/contentService";

export function HomePage() {
  const posts = useQuery({ queryKey: ["posts", "home"], queryFn: () => getPosts() });
  const training = useQuery({ queryKey: ["training", "home"], queryFn: getTrainingCourses });

  return (
    <>
      <Hero />
      <section className="section">
        <p className="thesis">Blog, formacion y chat asociado a cursos para trabajar metodologia clinica aplicada de forma clara y trazable.</p>
      </section>
      <section className="section">
        <div className="section-heading"><h2>Ultimos articulos</h2><Link to="/blog">Ver blog</Link></div>
        <div className="card-grid">{posts.data?.slice(0, 3).map((post) => <ArticleCard key={post._id} post={post} />)}</div>
      </section>
      <section className="section">
        <div className="section-heading"><h2>Formacion</h2><Link to="/formacion">Ver formacion</Link></div>
        <div className="card-grid">{training.data?.slice(0, 3).map((item) => <article className="content-card" key={item._id}><h3><Link to={`/formacion/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p></article>)}</div>
      </section>
    </>
  );
}
