import type { GuideDefinition } from "./guide.types";

export const guideDefinitions: GuideDefinition[] = [
  {
    id: "admin-overview",
    title: "Primer recorrido por el panel privado",
    description: "Aprende la estructura del backoffice, las metricas principales, accesos rapidos y navegacion.",
    category: "getting-started",
    difficulty: "basic",
    estimatedMinutes: 3,
    routeToStart: "/admin",
    steps: [
      { target: '[data-tour="dashboard-home"]', title: "Dashboard", content: "Esta es la vista general del sistema. Desde aqui ves el estado de contenido, consultas y accesos principales.", placement: "bottom" },
      { target: '[data-tour="dashboard-metrics"]', title: "Metricas", content: "Estas tarjetas resumen posts, noticias, consultas y recursos. Sirven para detectar actividad rapidamente.", placement: "bottom" },
      { target: '[data-tour="dashboard-quick-actions"]', title: "Accesos rapidos", content: "Usa estos accesos para crear contenido o revisar consultas sin navegar por todo el menu.", placement: "top" },
      { target: '[data-tour="admin-sidebar"]', title: "Sidebar", content: "El menu lateral agrupa todos los modulos privados: editorial, contenidos, CRM, medios, usuarios y auditoria.", placement: "right" },
      { target: '[data-tour="admin-sidebar-guides"]', title: "Guia interactiva", content: "Puedes volver a este centro cuando quieras repetir un flujo o aprender una nueva funcionalidad.", placement: "right" }
    ]
  },
  {
    id: "create-blog-post",
    title: "Crear y publicar un articulo de blog",
    description: "Aprende a crear un articulo, clasificarlo, revisar checklist editorial, preparar SEO y publicarlo.",
    category: "blog",
    difficulty: "basic",
    estimatedMinutes: 6,
    routeToStart: "/admin/posts/new",
    steps: [
      { target: '[data-tour="post-title"]', title: "Titulo del articulo", content: "Escribe un titulo claro y especifico. Debe anticipar el problema metodologico que resuelve el articulo.", placement: "bottom" },
      { target: '[data-tour="post-excerpt"]', title: "Extracto", content: "Resume el valor del articulo. Este texto aparece en listados y ayuda al lector a decidir si abrirlo.", placement: "bottom" },
      { target: '[data-tour="post-category"]', title: "Categoria", content: "Clasifica el articulo segun su familia metodologica: causalidad, prediccion, reporte, STATA, errores o general.", placement: "bottom" },
      { target: '[data-tour="post-tags"]', title: "Etiquetas", content: "Anade conceptos concretos como DAG, IPTW, calibracion, STROBE o TRIPOD. Ayudan a organizar clusters.", placement: "bottom" },
      { target: '[data-tour="rich-editor"]', title: "Editor cientifico", content: "Redacta el contenido principal. Puedes usar plantillas para estructurar problema, error, ejemplo, interpretacion y reporte.", placement: "top" },
      { target: '[data-tour="post-seo"]', title: "SEO y distribucion", content: "Revisa SEO title, meta description y texto para LinkedIn antes de publicar.", placement: "top" },
      { target: '[data-tour="post-save-draft"]', title: "Guardar borrador", content: "Guarda el contenido sin hacerlo publico. Los borradores no aparecen en la web publica.", placement: "top" },
      { target: '[data-tour="post-publish"]', title: "Publicar", content: "Publica solo cuando el checklist y la revision metodologica esten listos. Esta accion modifica datos reales.", placement: "top" }
    ]
  },
  {
    id: "create-news",
    title: "Crear una noticia",
    description: "Publica una actualizacion metodologica, guia, congreso o noticia comentada.",
    category: "news",
    difficulty: "basic",
    estimatedMinutes: 4,
    routeToStart: "/admin/news/new",
    steps: [
      { target: '[data-tour="post-title"]', title: "Titulo", content: "Define una noticia clara y orientada a utilidad metodologica.", placement: "bottom" },
      { target: '[data-tour="post-excerpt"]', title: "Extracto", content: "Resume que cambia y por que importa para investigadores clinicos.", placement: "bottom" },
      { target: '[data-tour="rich-editor"]', title: "Contenido", content: "Comenta la noticia con contexto, impacto y cautelas metodologicas.", placement: "top" },
      { target: '[data-tour="post-publish"]', title: "Publicar noticia", content: "Publica la noticia cuando este revisada. Aparecera en la seccion publica de noticias.", placement: "top" }
    ]
  },
  {
    id: "create-resource",
    title: "Subir un recurso",
    description: "Aprende a crear checklists, plantillas, guias, codigo o bibliografia.",
    category: "resources",
    difficulty: "basic",
    estimatedMinutes: 4,
    routeToStart: "/admin/resources/new",
    steps: [
      { target: '[data-tour="resource-title"]', title: "Titulo del recurso", content: "Pon un titulo que explique el uso practico del recurso.", placement: "bottom" },
      { target: '[data-tour="resource-type"]', title: "Tipo", content: "Clasifica si es checklist, plantilla, guia, codigo o bibliografia.", placement: "bottom" },
      { target: '[data-tour="resource-description"]', title: "Descripcion", content: "Explica a quien ayuda y en que momento del proyecto debe usarse.", placement: "bottom" },
      { target: '[data-tour="resource-status"]', title: "Estado", content: "Publica solo si el recurso esta listo para aparecer en la web publica.", placement: "top" }
    ]
  },
  {
    id: "manage-inquiries",
    title: "Gestionar consultas como CRM",
    description: "Convierte solicitudes de contacto en oportunidades con estado, prioridad, fuente y proxima accion.",
    category: "inquiries",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    routeToStart: "/admin/inquiries",
    steps: [
      { target: '[data-tour="inquiries-list"]', title: "Listado de consultas", content: "Aqui aparecen las consultas recibidas desde el formulario publico.", placement: "top" },
      { target: '[data-tour="inquiry-status"]', title: "Estado", content: "Actualiza el estado para saber si esta revisada, respondida, con propuesta o archivada.", placement: "bottom" },
      { target: '[data-tour="inquiry-priority"]', title: "Prioridad", content: "Marca prioridad alta cuando la consulta sea urgente, estrategica o de alto valor.", placement: "bottom" },
      { target: '[data-tour="inquiry-next-action"]', title: "Proxima accion", content: "Define el siguiente paso: responder, pedir datos, proponer reunion o enviar propuesta.", placement: "bottom" },
      { target: '[data-tour="inquiry-notes"]', title: "Notas internas", content: "Guarda contexto privado sin mostrarlo al usuario que envio la consulta.", placement: "top" }
    ]
  },
  {
    id: "media-library",
    title: "Usar la biblioteca de medios",
    description: "Aprende a subir, documentar, copiar URLs y reutilizar imagenes o documentos.",
    category: "resources",
    difficulty: "basic",
    estimatedMinutes: 4,
    routeToStart: "/admin/media",
    steps: [
      { target: '[data-tour="media-upload"]', title: "Subida de medios", content: "Desde aqui subes imagenes, PDFs o plantillas. La subida real requiere Cloudinary configurado.", placement: "bottom" },
      { target: '[data-tour="media-grid"]', title: "Grid de medios", content: "Aqui ves la biblioteca completa con metadatos y acciones de reutilizacion cuando existan archivos.", placement: "top" }
    ]
  },
  {
    id: "settings-public",
    title: "Modificar ajustes publicos",
    description: "Edita textos generales, hero, sobre mi, email y color de marca.",
    category: "settings",
    difficulty: "basic",
    estimatedMinutes: 4,
    routeToStart: "/admin/settings",
    adminOnly: true,
    steps: [
      { target: '[data-tour="settings-site-title"]', title: "Titulo del sitio", content: "Este texto identifica la web en zonas publicas y metadatos.", placement: "bottom" },
      { target: '[data-tour="settings-hero-title"]', title: "Hero", content: "Define el mensaje principal de la pagina de inicio.", placement: "bottom" },
      { target: '[data-tour="settings-about-text"]', title: "Sobre mi", content: "Actualiza el texto de presentacion profesional.", placement: "top" },
      { target: '[data-tour="settings-save"]', title: "Guardar ajustes", content: "Guarda solo cuando los cambios publicos esten revisados.", placement: "top" }
    ]
  },
  {
    id: "users-roles",
    title: "Gestionar usuarios y roles",
    description: "Crea usuarios internos, cambia roles, activa/desactiva y resetea contrasenas.",
    category: "security",
    difficulty: "advanced",
    estimatedMinutes: 5,
    routeToStart: "/admin/users",
    adminOnly: true,
    steps: [
      { target: '[data-tour="users-create"]', title: "Crear usuario", content: "Da de alta editores, revisores o viewers con password temporal.", placement: "bottom" },
      { target: '[data-tour="users-table"]', title: "Listado de usuarios", content: "Gestiona roles, estado y ultimo acceso desde esta tabla.", placement: "top" },
      { target: '[data-tour="user-role"]', title: "Rol", content: "Usa admin solo para personas que deban gestionar usuarios y ajustes criticos.", placement: "bottom" }
    ]
  }
];
