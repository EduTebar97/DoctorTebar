import { connectDB, disconnectDB } from "../config/db.js";
import { News } from "../models/News.model.js";
import { Post } from "../models/Post.model.js";
import { Resource } from "../models/Resource.model.js";
import { Service } from "../models/Service.model.js";
import { slugify } from "../utils/slugify.js";

const posts = [
  ["Que es un estimando causal y por que importa", "Antes del modelo estadistico hay que definir con precision el efecto clinico que se quiere estimar.", "causalidad"],
  ["AUC no es suficiente: calibracion y utilidad clinica", "La discriminacion no basta para decidir si un modelo predictivo ayuda en decisiones clinicas reales.", "prediccion"],
  ["Como reportar un estudio observacional segun STROBE", "Una guia practica para alinear pregunta, diseno, analisis e informe final.", "reporte"]
] as const;

const services = [
  ["Asesoria pre-protocolo", "Refinamiento de pregunta clinica, diseno, outcome, estimando y plan de analisis."],
  ["Asesoria de analisis", "Modelos multivariables, supervivencia, propensity score, IPTW e imputacion multiple."],
  ["Asesoria pre-envio", "Revision metodologica de manuscritos antes del envio a revista."],
  ["Respuesta a revisores", "Respuestas tecnicas y reformulacion de analisis ante comentarios estadisticos."]
] as const;

async function seedDemoContent() {
  await connectDB();
  for (const [title, excerpt, category] of posts) {
    await Post.updateOne(
      { slug: slugify(title) },
      { $setOnInsert: { title, slug: slugify(title), excerpt, category, content: `<p>${excerpt}</p>`, status: "published", featured: true, tags: [category], publishedAt: new Date() } },
      { upsert: true }
    );
  }
  for (const [index, [title, shortDescription]] of services.entries()) {
    await Service.updateOne(
      { slug: slugify(title) },
      { $setOnInsert: { title, slug: slugify(title), shortDescription, fullDescription: shortDescription, targetAudience: "Investigadores clinicos", deliverables: ["Informe metodologico", "Plan de accion"], status: "published", order: index } },
      { upsert: true }
    );
  }
  await News.updateOne(
    { slug: "tripod-ai-en-practica-clinica" },
    { $setOnInsert: { title: "TRIPOD+AI en practica clinica", slug: "tripod-ai-en-practica-clinica", excerpt: "Nuevos estandares para reportar modelos predictivos con componentes de inteligencia artificial.", content: "<p>Resumen practico para investigadores clinicos.</p>", status: "published", featured: true, publishedAt: new Date() } },
    { upsert: true }
  );
  await Resource.updateOne(
    { title: "Checklist pre-analisis metodologico" },
    { $setOnInsert: { title: "Checklist pre-analisis metodologico", description: "Lista de comprobacion para llegar al analisis con pregunta, variables y decisiones principales alineadas.", type: "checklist", status: "published" } },
    { upsert: true }
  );
  console.log("Demo content seeded");
  await disconnectDB();
}

seedDemoContent().catch((error) => {
  console.error(error);
  process.exit(1);
});
