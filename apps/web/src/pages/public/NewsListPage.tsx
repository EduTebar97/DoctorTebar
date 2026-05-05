import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getNews } from "../../services/contentService";

export function NewsListPage() {
  const { data } = useQuery({ queryKey: ["news"], queryFn: getNews });
  return <section className="section"><h1>Noticias</h1><div className="card-grid">{data?.map((item) => <article className="content-card" key={item._id}><h3><Link to={`/noticias/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p>{item.sourceName ? <span>{item.sourceName}</span> : null}</article>)}</div></section>;
}
