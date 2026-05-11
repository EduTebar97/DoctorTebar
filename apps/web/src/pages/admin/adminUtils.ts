export function contentCompleteness(item: Record<string, unknown>) {
  const checks = [
    Boolean(item.title),
    Boolean(item.excerpt ?? item.description ?? item.shortDescription),
    Boolean(item.content ?? item.fullDescription ?? item.fileUrl ?? item.externalUrl),
    Boolean(item.status),
    Boolean(item.seoTitle ?? item.type ?? item.targetAudience),
    Boolean(item.seoDescription ?? item.tags ?? item.deliverables)
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString("es-ES") : "Sin fecha";
}

export function buildLinkedInDraft(title: string, excerpt?: string, slug?: string) {
  const url = slug ? `${window.location.origin}/blog/${slug}?utm_source=linkedin&utm_medium=social&utm_campaign=blog_metodologia` : "";
  return [
    `${title}`,
    "",
    excerpt ?? "Nueva pieza de metodologia clinica aplicada.",
    "",
    "Una lectura para alinear pregunta, diseno, estimando, analisis e interpretacion.",
    "",
    url,
    "",
    "#InvestigacionClinica #Bioestadistica #Metodologia #Causalidad"
  ].join("\n");
}
