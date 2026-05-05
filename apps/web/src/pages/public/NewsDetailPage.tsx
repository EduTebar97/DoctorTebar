import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNewsItem } from "../../services/contentService";

export function NewsDetailPage() {
  const { slug = "" } = useParams();
  const { data } = useQuery({ queryKey: ["news", slug], queryFn: () => getNewsItem(slug) });
  return <article className="section article-page"><h1>{data?.title}</h1><p className="lead">{data?.excerpt}</p>{data?.sourceUrl ? <a href={data.sourceUrl} target="_blank" rel="noreferrer">{data.sourceName ?? "Fuente"}</a> : null}<div className="article-html" dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} /></article>;
}
