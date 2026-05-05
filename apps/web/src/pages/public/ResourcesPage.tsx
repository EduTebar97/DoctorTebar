import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getResources } from "../../services/contentService";

export function ResourcesPage() {
  const { data } = useQuery({ queryKey: ["resources"], queryFn: getResources });
  return <section className="section"><h1>Recursos</h1><div className="card-grid">{data?.map((item) => <article className="content-card" key={item._id}><h3>{item.title}</h3><p>{item.description}</p><span>{item.type}</span>{item.fileUrl || item.externalUrl ? <a className="btn secondary" href={item.fileUrl || item.externalUrl}><Download size={18} /> Abrir</a> : null}</article>)}</div></section>;
}
