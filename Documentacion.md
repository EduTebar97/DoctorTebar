
# Documento técnico maestro — Plataforma de metodología clínica aplicada de Eduardo Tebar Boti

**Proyecto:** Plataforma web profesional de metodología clínica aplicada, blog, noticias, recursos y asesoría estadística.  
**Autor funcional del proyecto:** Eduardo Tebar Boti, médico.  
**Objetivo:** transformar el prototipo HTML local en una aplicación real de producción con frontend, backend, base de datos, autenticación, panel privado de administración, zona pública, tests automatizados, despliegue y medidas de seguridad.

---

## 0. Introducción ejecutiva

Este documento describe cómo convertir el prototipo actual de una sola página HTML con React desde CDN y persistencia en `localStorage` en una aplicación web profesional lista para producción.

El prototipo inicial sirve para validar la experiencia visual y funcional. Sin embargo, para una aplicación real se necesita separar responsabilidades:

1. **Frontend público**
   - Inicio.
   - Sobre mí.
   - Servicios.
   - Blog.
   - Noticias.
   - Recursos.
   - Contacto.
   - Vista individual de artículos/noticias.
   - Formularios públicos.

2. **Frontend privado / backoffice**
   - Login seguro.
   - Dashboard interno.
   - Gestión completa de posts.
   - Gestión de noticias.
   - Gestión de servicios.
   - Gestión de recursos descargables.
   - Gestión de formularios recibidos.
   - Gestión de usuarios administradores.
   - Configuración de la página pública.
   - Visualización de estadísticas.

3. **Backend API**
   - Autenticación.
   - Autorización.
   - CRUD de contenidos.
   - Gestión de medios.
   - Validación de datos.
   - Seguridad.
   - Auditoría.
   - Notificaciones internas.
   - Endpoints REST.

4. **Base de datos**
   - Almacenamiento real y persistente.
   - Artículos.
   - Noticias.
   - Usuarios.
   - Consultas.
   - Recursos.
   - Configuración pública.
   - Logs de auditoría.

5. **Testing**
   - Unitarios.
   - Integración.
   - End-to-end.
   - API tests.
   - Seguridad básica.
   - Validación de formularios.
   - Validación de roles.

6. **Despliegue**
   - Frontend en Vercel o Netlify.
   - Backend en Render, Railway o Fly.io.
   - Base de datos en MongoDB Atlas.
   - Repositorio en GitHub.
   - Integración continua con GitHub Actions.

> Nota importante: ningún documento puede garantizar literalmente “cero errores” o “cero riesgo de ciberseguridad”. Lo correcto en producción es establecer una arquitectura robusta, pruebas automatizadas, validaciones, revisiones, logs, backups y procesos de despliegue controlado que reduzcan al máximo los fallos y permitan detectarlos rápidamente.

---

## 1. Visión funcional del producto

La aplicación debe funcionar como una plataforma profesional de metodología clínica aplicada. No debe parecer un blog genérico de estadística médica, sino una web especializada en investigación clínica rigurosa.

### 1.1. Tesis editorial

La plataforma se organiza alrededor de una tesis central:

> La investigación clínica rigurosa exige alinear pregunta, diseño, estimando, datos, modelo estadístico, supuestos, interpretación y reporte.

### 1.2. Identidad profesional

La web debe presentar a:

**Eduardo Tebar Boti**  
Médico especializado en metodología clínica aplicada, análisis estadístico, causalidad clínica, modelos predictivos, estudios observacionales, reporte científico y apoyo metodológico a investigadores clínicos.

### 1.3. Familias de contenido

La plataforma debe diferenciar de forma permanente entre:

1. **Investigación explicativo-causal**
   - Efectos de tratamientos.
   - Efectos de exposiciones.
   - Efectos de procedimientos.
   - Target trial emulation.
   - DAGs.
   - Propensity score.
   - IPTW.
   - Sesgos temporales.
   - Confusión por indicación.
   - Estimandos causales.

2. **Investigación predictivo-pronóstica**
   - Desarrollo de modelos.
   - Validación interna.
   - Validación externa.
   - Calibración.
   - AUC y limitaciones.
   - Brier score.
   - Decision curve analysis.
   - TRIPOD+AI.
   - PROBAST/PROBAST+AI.

3. **Reporte y reproducibilidad**
   - STROBE.
   - CONSORT.
   - TRIPOD+AI.
   - PRISMA.
   - RECORD.
   - Plantillas de métodos.
   - Respuesta a revisores.
   - Código reproducible.

4. **Asesoría metodológica**
   - Consulta pre-protocolo.
   - Consulta durante el análisis.
   - Consulta pre-envío.
   - Respuesta a revisores.
   - Crítica metodológica de artículos.

---

## 2. De prototipo HTML a arquitectura real

### 2.1. Situación actual

El prototipo actual es un único archivo HTML que incluye:

- React desde CDN.
- Babel en navegador.
- CSS embebido.
- Datos en `localStorage`.
- Rutas simuladas en estado local.
- Panel público.
- Panel interno.
- Editor de contenidos.
- Formularios simulados.

Esto es útil para enseñar la idea a potenciales colaboradores o clientes, pero no es una arquitectura adecuada para producción.

### 2.2. Limitaciones del prototipo

El prototipo actual tiene estas limitaciones:

- No hay autenticación real.
- No hay usuarios reales.
- No hay base de datos remota.
- `localStorage` solo guarda datos en un navegador.
- No hay API.
- No hay validación robusta.
- No hay seguridad backend.
- No hay subida real de imágenes/documentos.
- No hay tests automatizados reales.
- No hay logs.
- No hay control de permisos.
- No hay backups.
- No hay monitorización.
- No hay despliegue desacoplado.

### 2.3. Objetivo de la versión real

Crear una aplicación full-stack con:

- **Frontend:** React + Vite + TypeScript.
- **Backend:** Node.js + Express + TypeScript.
- **Base de datos:** MongoDB Atlas.
- **Autenticación:** JWT en cookies httpOnly.
- **Subida de medios:** Cloudinary o almacenamiento compatible S3.
- **Testing frontend:** Vitest + React Testing Library.
- **Testing backend:** Vitest/Jest + Supertest.
- **Testing E2E:** Playwright.
- **Despliegue frontend:** Vercel o Netlify.
- **Despliegue backend:** Render o Railway.
- **CI/CD:** GitHub Actions.
- **Contenedores locales:** Docker Compose opcional.

---

## 3. Stack tecnológico recomendado

### 3.1. Frontend

Recomendación:

```txt
React 18/19
Vite
TypeScript
React Router
TanStack Query
React Hook Form
Zod
Tailwind CSS
Framer Motion
Lucide React
Recharts
TipTap o React Quill
Axios
Vitest
React Testing Library
Playwright
```

Motivo:

- React + Vite es simple, rápido y estable.
- TypeScript reduce errores.
- React Router permite rutas reales.
- TanStack Query gestiona llamadas al backend.
- React Hook Form + Zod simplifican formularios seguros.
- Tailwind permite diseño moderno.
- Framer Motion permite microinteracciones.
- Recharts permite dashboards.
- TipTap o React Quill permite editor enriquecido para blogs.
- Playwright permite simular flujos completos de usuario.

### 3.2. Backend

Recomendación:

```txt
Node.js
Express
TypeScript
Mongoose
Zod
bcrypt
jsonwebtoken
cookie-parser
helmet
cors
express-rate-limit
multer
cloudinary
morgan
winston
supertest
vitest/jest
```

Motivo:

- Express es sencillo y suficientemente robusto.
- Mongoose facilita MongoDB.
- Zod valida inputs.
- bcrypt protege contraseñas.
- JWT en cookies httpOnly reduce exposición de tokens.
- helmet mejora cabeceras de seguridad.
- rate-limit reduce ataques de fuerza bruta.
- multer permite carga de ficheros.
- Cloudinary simplifica gestión de imágenes.
- Winston permite logs.

### 3.3. Base de datos

Recomendación principal:

```txt
MongoDB Atlas
```

Motivo:

- Modelo documental adecuado para posts, noticias, recursos y formularios.
- Free tier suficiente para empezar.
- Fácil conexión con Node/Express.
- Menos fricción que una base relacional para contenido editorial.
- Flexible para campos dinámicos.

Alternativa:

```txt
MariaDB / PostgreSQL
```

Sería recomendable si en el futuro se necesita una estructura muy transaccional, relaciones complejas o reporting avanzado. Para este proyecto, MongoDB es más sencillo y menos propenso a errores iniciales.

---

## 4. Entornos del proyecto

Deben existir tres entornos:

### 4.1. Desarrollo local

Uso:

- Programación diaria.
- Pruebas manuales.
- Tests unitarios.
- Debug.

Servicios:

- Frontend en `http://localhost:5173`.
- Backend en `http://localhost:4000`.
- MongoDB local mediante Docker o MongoDB Atlas dev.
- Variables `.env.local`.

### 4.2. Staging

Uso:

- Validación antes de producción.
- Tests E2E.
- Revisión visual.
- Pruebas con datos ficticios.

Servicios:

- Frontend staging: `https://staging.eduardotebarbotic.com`.
- Backend staging: `https://api-staging.eduardotebarbotic.com`.
- Base de datos MongoDB Atlas staging.
- Variables separadas de producción.

### 4.3. Producción

Uso:

- Web pública real.
- Panel privado real.
- Datos reales.
- Formularios reales.
- Usuarios reales.

Servicios:

- Frontend producción: `https://eduardotebarbotic.com`.
- Backend producción: `https://api.eduardotebarbotic.com`.
- Base de datos MongoDB Atlas producción.
- Backups.
- Logs.
- Monitorización.

---

## 5. Repositorios

Se recomiendan dos opciones.

### 5.1. Opción A: monorepo

Un único repositorio:

```txt
eduardo-metodologia-clinica/
  apps/
    web/
    api/
  packages/
    shared/
  docs/
  e2e/
  docker-compose.yml
  README.md
```

Ventajas:

- Todo centralizado.
- Fácil compartir tipos entre frontend y backend.
- Mejor para un proyecto pequeño-mediano.

### 5.2. Opción B: repositorios separados

```txt
eduardo-web-frontend
eduardo-web-api
eduardo-web-e2e
```

Ventajas:

- Separación total.
- Despliegues independientes.

Inconvenientes:

- Más configuración.
- Más repositorios que mantener.

### 5.3. Recomendación

Para este proyecto recomiendo **monorepo** porque es más sencillo de gestionar y permite compartir tipos, validadores y documentación.

---

## 6. Estructura completa del proyecto

```txt
eduardo-metodologia-clinica/
  README.md
  package.json
  pnpm-workspace.yaml
  .gitignore
  .editorconfig
  .env.example
  docker-compose.yml

  apps/
    web/
      index.html
      package.json
      vite.config.ts
      tsconfig.json
      tailwind.config.ts
      postcss.config.js
      src/
        main.tsx
        App.tsx
        router/
          AppRouter.tsx
          PublicRoutes.tsx
          AdminRoutes.tsx
          ProtectedRoute.tsx
        layouts/
          PublicLayout.tsx
          AdminLayout.tsx
        pages/
          public/
            HomePage.tsx
            AboutPage.tsx
            ServicesPage.tsx
            BlogListPage.tsx
            BlogDetailPage.tsx
            NewsListPage.tsx
            NewsDetailPage.tsx
            ResourcesPage.tsx
            ContactPage.tsx
          admin/
            AdminDashboardPage.tsx
            AdminPostsPage.tsx
            AdminPostEditorPage.tsx
            AdminNewsPage.tsx
            AdminNewsEditorPage.tsx
            AdminResourcesPage.tsx
            AdminServicesPage.tsx
            AdminInquiriesPage.tsx
            AdminSettingsPage.tsx
            AdminUsersPage.tsx
            LoginPage.tsx
        components/
          public/
            Hero.tsx
            FeatureGrid.tsx
            ServiceCard.tsx
            ArticleCard.tsx
            PublicNavbar.tsx
            PublicFooter.tsx
            NewsletterBox.tsx
            ContactForm.tsx
          admin/
            Sidebar.tsx
            Topbar.tsx
            StatCard.tsx
            ContentTable.tsx
            PostEditorForm.tsx
            NewsEditorForm.tsx
            ResourceForm.tsx
            ConfirmDialog.tsx
            RichTextEditor.tsx
            MediaUploader.tsx
          common/
            Button.tsx
            Input.tsx
            Textarea.tsx
            Select.tsx
            Badge.tsx
            Modal.tsx
            Loader.tsx
            EmptyState.tsx
            ErrorMessage.tsx
        hooks/
          useAuth.ts
          usePosts.ts
          useNews.ts
          useResources.ts
          useInquiries.ts
        services/
          apiClient.ts
          authService.ts
          postService.ts
          newsService.ts
          resourceService.ts
          inquiryService.ts
          mediaService.ts
        schemas/
          post.schema.ts
          news.schema.ts
          inquiry.schema.ts
          auth.schema.ts
        types/
          content.types.ts
          user.types.ts
        styles/
          globals.css
        tests/
          components/
          pages/
          services/

    api/
      package.json
      tsconfig.json
      src/
        server.ts
        app.ts
        config/
          env.ts
          db.ts
          cors.ts
          cloudinary.ts
        models/
          User.model.ts
          Post.model.ts
          News.model.ts
          Resource.model.ts
          Inquiry.model.ts
          Service.model.ts
          SiteSettings.model.ts
          AuditLog.model.ts
          MediaAsset.model.ts
        routes/
          auth.routes.ts
          posts.routes.ts
          news.routes.ts
          resources.routes.ts
          inquiries.routes.ts
          services.routes.ts
          settings.routes.ts
          media.routes.ts
          users.routes.ts
          health.routes.ts
        controllers/
          auth.controller.ts
          posts.controller.ts
          news.controller.ts
          resources.controller.ts
          inquiries.controller.ts
          services.controller.ts
          settings.controller.ts
          media.controller.ts
          users.controller.ts
        services/
          auth.service.ts
          posts.service.ts
          news.service.ts
          resources.service.ts
          inquiries.service.ts
          media.service.ts
          email.service.ts
          audit.service.ts
        middleware/
          auth.middleware.ts
          requireRole.middleware.ts
          validate.middleware.ts
          error.middleware.ts
          rateLimit.middleware.ts
          upload.middleware.ts
        schemas/
          auth.schema.ts
          post.schema.ts
          news.schema.ts
          inquiry.schema.ts
          resource.schema.ts
          service.schema.ts
          settings.schema.ts
        utils/
          ApiError.ts
          asyncHandler.ts
          slugify.ts
          pagination.ts
          sanitizeHtml.ts
        seeds/
          seedAdmin.ts
          seedDemoContent.ts
        tests/
          auth.test.ts
          posts.test.ts
          news.test.ts
          inquiries.test.ts
          resources.test.ts
          setup.ts

  packages/
    shared/
      package.json
      src/
        types/
        constants/
        validators/

  e2e/
    package.json
    playwright.config.ts
    tests/
      public-navigation.spec.ts
      admin-login.spec.ts
      admin-create-post.spec.ts
      contact-form.spec.ts
      publish-workflow.spec.ts

  docs/
    arquitectura.md
    api-endpoints.md
    modelo-datos.md
    despliegue.md
    seguridad.md
    testing.md
    manual-admin.md
```

---

## 7. Modelo de datos

### 7.1. Usuario

Representa usuarios que pueden acceder al panel privado.

```ts
interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  status: "active" | "disabled";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

Roles:

- `admin`: acceso completo.
- `editor`: puede gestionar posts, noticias y recursos, pero no usuarios ni ajustes críticos.

### 7.2. Post de blog

```ts
interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: "causalidad" | "prediccion" | "reporte" | "stata" | "errores" | "general";
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  authorId: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.3. Noticia

```ts
interface News {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.4. Recurso

```ts
interface Resource {
  _id: string;
  title: string;
  description: string;
  type: "checklist" | "plantilla" | "guia" | "codigo" | "bibliografia";
  fileUrl?: string;
  externalUrl?: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.5. Servicio

```ts
interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  deliverables: string[];
  status: "draft" | "published" | "archived";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.6. Consulta recibida

```ts
interface Inquiry {
  _id: string;
  name: string;
  email: string;
  organization?: string;
  projectStage: "idea" | "protocolo" | "analisis" | "manuscrito" | "revision";
  objectiveType: "causal" | "predictivo" | "descriptivo" | "diagnostico" | "pronostico" | "mixto" | "no_claro";
  message: string;
  status: "new" | "reviewed" | "replied" | "archived";
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 7.7. Configuración pública

```ts
interface SiteSettings {
  _id: string;
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  linkedinUrl?: string;
  accentColor?: string;
  updatedAt: Date;
}
```

### 7.8. Auditoría

```ts
interface AuditLog {
  _id: string;
  userId?: string;
  action: string;
  entity: "post" | "news" | "resource" | "service" | "settings" | "user" | "auth";
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}
```

---

## 8. Rutas públicas

### 8.1. Mapa de rutas

```txt
/                         Inicio
/sobre-mi                 Sobre mí
/servicios                Servicios
/blog                     Listado de artículos
/blog/:slug               Detalle de artículo
/noticias                 Listado de noticias
/noticias/:slug           Detalle de noticia
/recursos                 Recursos
/contacto                 Contacto y asesoría
/login                    Login privado
```

### 8.2. Página de inicio

Debe incluir:

- Hero principal.
- Frase editorial.
- CTA a asesoría.
- CTA a blog.
- Tres pilares:
  - Causalidad clínica aplicada.
  - Predicción y pronóstico.
  - Reporte y reproducibilidad.
- Últimos artículos.
- Últimas noticias.
- Servicios destacados.
- Formulario breve o acceso a contacto.

### 8.3. Sobre mí

Debe incluir:

- Nombre: Eduardo Tebar Boti.
- Perfil: médico.
- Enfoque metodológico.
- Áreas de trabajo:
  - metodología clínica,
  - causalidad,
  - modelos predictivos,
  - STROBE,
  - TRIPOD+AI,
  - análisis en STATA 17,
  - revisión metodológica.
- Propuesta de valor:
  - convertir preguntas clínicas en diseños analizables,
  - evitar errores habituales,
  - mejorar manuscritos,
  - apoyar respuesta a revisores.

### 8.4. Servicios

Servicios recomendados:

1. **Asesoría pre-protocolo**
   - Refinamiento de pregunta clínica.
   - Diseño.
   - Outcome.
   - Estimando.
   - Tamaño muestral.
   - Plan de análisis.

2. **Asesoría de análisis**
   - Limpieza de datos.
   - Modelos multivariables.
   - Supervivencia.
   - Propensity score.
   - IPTW.
   - Imputación múltiple.
   - Bootstrap.

3. **Asesoría pre-envío**
   - Revisión de métodos.
   - Coherencia objetivo-métodos-resultados-conclusión.
   - Revisión STROBE, CONSORT, TRIPOD+AI.
   - Redacción metodológica.

4. **Respuesta a revisores**
   - Revisión de comentarios estadísticos.
   - Respuestas técnicas.
   - Reformulación de análisis.
   - Justificación metodológica.

### 8.5. Blog público

Debe permitir:

- Listar posts publicados.
- Filtrar por categoría.
- Buscar por texto.
- Ordenar por fecha.
- Abrir detalle por slug.
- Mostrar tags.
- Mostrar lectura estimada.
- Mostrar artículos relacionados.

### 8.6. Noticias públicas

Debe permitir:

- Listar noticias publicadas.
- Abrir noticia individual.
- Mostrar fuente si existe.
- Mostrar fecha.
- Mostrar noticias destacadas.

### 8.7. Contacto

Formulario:

- Nombre.
- Email.
- Organización.
- Fase del proyecto.
- Tipo de objetivo.
- Mensaje.
- Consentimiento de contacto.

Al enviar:

- Crear `Inquiry` en base de datos.
- Mostrar confirmación.
- Notificar internamente en dashboard.
- Opcionalmente enviar email.

---

## 9. Rutas privadas

### 9.1. Mapa de rutas

```txt
/admin                         Dashboard interno
/admin/posts                   Gestión de blog
/admin/posts/new               Crear post
/admin/posts/:id/edit          Editar post
/admin/news                    Gestión de noticias
/admin/news/new                Crear noticia
/admin/news/:id/edit           Editar noticia
/admin/resources               Recursos
/admin/services                Servicios
/admin/inquiries               Consultas recibidas
/admin/settings                Ajustes de sitio
/admin/users                   Usuarios
```

### 9.2. Dashboard interno

Debe mostrar:

- Número de posts publicados.
- Número de borradores.
- Número de noticias.
- Consultas nuevas.
- Recursos publicados.
- Gráfico de publicaciones por categoría.
- Últimas consultas.
- Últimas acciones.
- Accesos rápidos:
  - Nuevo post.
  - Nueva noticia.
  - Nuevo recurso.
  - Revisar consultas.

### 9.3. Gestión de posts

Acciones:

- Crear.
- Editar.
- Guardar borrador.
- Publicar.
- Archivar.
- Eliminar.
- Subir imagen destacada.
- Previsualizar.
- Editar SEO.
- Gestionar tags.
- Filtrar por estado.
- Buscar por título.

### 9.4. Gestión de noticias

Igual que posts, pero con:

- Fuente.
- URL externa.
- Fecha de publicación.
- Categoría opcional.

### 9.5. Gestión de recursos

Acciones:

- Crear recurso.
- Subir PDF/plantilla.
- Añadir URL externa.
- Publicar/ocultar.
- Clasificar por tipo.
- Editar descripción.

### 9.6. Gestión de servicios

Acciones:

- Crear servicio.
- Editar descripción pública.
- Reordenar servicios.
- Activar/desactivar.
- Añadir entregables.

### 9.7. Gestión de consultas

Acciones:

- Ver consulta.
- Cambiar estado.
- Añadir notas internas.
- Marcar como respondida.
- Archivar.
- Filtrar por tipo de objetivo.
- Filtrar por fase del proyecto.

### 9.8. Ajustes

Acciones:

- Editar texto principal de inicio.
- Editar texto sobre mí.
- Editar email de contacto.
- Editar enlaces externos.
- Editar colores de marca.
- Editar mensajes automáticos.

---

## 10. API REST

### 10.1. Auth

```txt
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/change-password
```

### 10.2. Posts

Público:

```txt
GET    /api/posts
GET    /api/posts/:slug
```

Privado:

```txt
GET    /api/admin/posts
GET    /api/admin/posts/:id
POST   /api/admin/posts
PUT    /api/admin/posts/:id
DELETE /api/admin/posts/:id
PATCH  /api/admin/posts/:id/publish
PATCH  /api/admin/posts/:id/archive
```

### 10.3. Noticias

Público:

```txt
GET    /api/news
GET    /api/news/:slug
```

Privado:

```txt
GET    /api/admin/news
GET    /api/admin/news/:id
POST   /api/admin/news
PUT    /api/admin/news/:id
DELETE /api/admin/news/:id
PATCH  /api/admin/news/:id/publish
PATCH  /api/admin/news/:id/archive
```

### 10.4. Recursos

Público:

```txt
GET    /api/resources
```

Privado:

```txt
GET    /api/admin/resources
POST   /api/admin/resources
PUT    /api/admin/resources/:id
DELETE /api/admin/resources/:id
PATCH  /api/admin/resources/:id/publish
```

### 10.5. Servicios

Público:

```txt
GET    /api/services
```

Privado:

```txt
GET    /api/admin/services
POST   /api/admin/services
PUT    /api/admin/services/:id
DELETE /api/admin/services/:id
```

### 10.6. Consultas

Público:

```txt
POST   /api/inquiries
```

Privado:

```txt
GET    /api/admin/inquiries
GET    /api/admin/inquiries/:id
PATCH  /api/admin/inquiries/:id/status
PATCH  /api/admin/inquiries/:id/notes
DELETE /api/admin/inquiries/:id
```

### 10.7. Medios

Privado:

```txt
POST   /api/admin/media/upload
GET    /api/admin/media
DELETE /api/admin/media/:id
```

### 10.8. Ajustes

Público:

```txt
GET    /api/settings/public
```

Privado:

```txt
GET    /api/admin/settings
PUT    /api/admin/settings
```

### 10.9. Healthcheck

```txt
GET    /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "uptime": 12345,
  "database": "connected",
  "timestamp": "2026-05-05T10:00:00.000Z"
}
```

---

## 11. Seguridad

### 11.1. Autenticación

- Login con email y contraseña.
- Contraseña hasheada con bcrypt.
- JWT firmado con secreto fuerte.
- JWT almacenado en cookie httpOnly.
- Cookie con `secure: true` en producción.
- Cookie con `sameSite: "lax"` o `"strict"` según arquitectura.

### 11.2. Autorización

Middleware:

```txt
requireAuth
requireRole("admin")
requireRole("editor")
```

Reglas:

- Solo admin gestiona usuarios.
- Editor puede gestionar contenido.
- Público solo accede a contenido publicado.
- Borradores nunca deben verse en API pública.

### 11.3. Validación de entrada

Usar Zod en todos los endpoints.

Ejemplo:

```ts
const createPostSchema = z.object({
  title: z.string().min(5).max(180),
  excerpt: z.string().min(20).max(400),
  content: z.string().min(100),
  category: z.enum(["causalidad", "prediccion", "reporte", "stata", "errores", "general"]),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft")
});
```

### 11.4. Sanitización HTML

Como el editor de blog permite contenido enriquecido, hay que sanitizar:

- Quitar scripts.
- Quitar atributos peligrosos.
- Permitir solo etiquetas seguras.
- Sanitizar antes de guardar o antes de renderizar.

Usar:

```txt
sanitize-html
```

### 11.5. Cabeceras de seguridad

Usar:

```txt
helmet
```

Activar:

- Content-Security-Policy.
- X-Frame-Options.
- X-Content-Type-Options.
- Referrer-Policy.

### 11.6. Rate limiting

Aplicar límites a:

- Login.
- Formulario público.
- Uploads.
- Endpoints sensibles.

Ejemplo:

```txt
/login: máximo 5 intentos cada 15 minutos por IP
/inquiries: máximo 5 envíos cada hora por IP
```

### 11.7. CORS

Permitir solo dominios concretos:

Desarrollo:

```txt
http://localhost:5173
```

Staging:

```txt
https://staging.eduardotebarbotic.com
```

Producción:

```txt
https://eduardotebarbotic.com
```

Nunca usar `origin: "*"` con cookies.

### 11.8. Subida de ficheros

Reglas:

- Limitar tamaño.
- Permitir solo tipos MIME seguros.
- No ejecutar ficheros.
- Renombrar archivos.
- Almacenar fuera del servidor o en Cloudinary/S3.
- Validar imágenes.
- Escanear o restringir PDFs si se aceptan documentos.

### 11.9. Logs y auditoría

Registrar:

- Login exitoso.
- Login fallido.
- Creación de post.
- Publicación.
- Eliminación.
- Cambio de ajustes.
- Subida de medio.
- Creación de usuario.

### 11.10. Backups

MongoDB Atlas permite backups según plan. En free tier se recomienda exportar periódicamente:

```bash
mongodump --uri "$MONGODB_URI"
```

---

## 12. Instalación local paso a paso

### 12.1. Requisitos previos

Instalar:

```txt
Node.js LTS
pnpm
Git
Docker Desktop opcional
Visual Studio Code
Cuenta GitHub
Cuenta MongoDB Atlas
Cuenta Cloudinary
Cuenta Vercel/Netlify
Cuenta Render/Railway
```

### 12.2. Crear proyecto

```bash
mkdir eduardo-metodologia-clinica
cd eduardo-metodologia-clinica
git init
pnpm init
```

### 12.3. Crear workspace

Archivo `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "e2e"
```

### 12.4. Crear frontend

```bash
mkdir -p apps
cd apps
pnpm create vite web --template react-ts
cd web
pnpm install
```

Instalar dependencias:

```bash
pnpm add react-router-dom @tanstack/react-query axios zod react-hook-form @hookform/resolvers lucide-react recharts framer-motion
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

### 12.5. Crear backend

```bash
cd ../../apps
mkdir api
cd api
pnpm init
pnpm add express mongoose zod bcrypt jsonwebtoken cookie-parser helmet cors express-rate-limit multer cloudinary morgan winston dotenv sanitize-html
pnpm add -D typescript tsx vitest supertest @types/express @types/bcrypt @types/jsonwebtoken @types/cookie-parser @types/cors @types/multer @types/sanitize-html
npx tsc --init
```

### 12.6. Scripts principales

`apps/web/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

`apps/api/package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "seed:admin": "tsx src/seeds/seedAdmin.ts",
    "seed:demo": "tsx src/seeds/seedDemoContent.ts"
  }
}
```

Raíz `package.json`:

```json
{
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api dev",
    "test": "pnpm -r test",
    "build": "pnpm -r build"
  }
}
```

---

## 13. Variables de entorno

### 13.1. Backend `.env.example`

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/eduardo_metodologia
JWT_SECRET=change_me_super_secret
JWT_EXPIRES_IN=7d
COOKIE_NAME=etb_session
CLIENT_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
NOTIFICATION_EMAIL=
```

### 13.2. Frontend `.env.example`

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Eduardo Tebar Boti | Metodología Clínica
```

---

## 14. Configuración backend esencial

### 14.1. `src/config/env.ts`

```ts
import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieName: process.env.COOKIE_NAME ?? "etb_session",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};
```

### 14.2. `src/config/db.ts`

```ts
import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
}
```

### 14.3. `src/app.ts`

```ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import postsRoutes from "./routes/posts.routes";
import newsRoutes from "./routes/news.routes";
import resourcesRoutes from "./routes/resources.routes";
import inquiriesRoutes from "./routes/inquiries.routes";
import settingsRoutes from "./routes/settings.routes";
import healthRoutes from "./routes/health.routes";

export const app = express();

app.use(helmet());
app.use(cors({
  origin: env.clientOrigin,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", postsRoutes);
app.use("/api", newsRoutes);
app.use("/api", resourcesRoutes);
app.use("/api", inquiriesRoutes);
app.use("/api", settingsRoutes);

app.use(errorMiddleware);
```

### 14.4. `src/server.ts`

```ts
import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

async function bootstrap() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
}

bootstrap();
```

---

## 15. Modelos Mongoose

### 15.1. `User.model.ts`

```ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

### 15.2. `Post.model.ts`

```ts
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImageUrl: String,
    category: {
      type: String,
      enum: ["causalidad", "prediccion", "reporte", "stata", "errores", "general"],
      default: "general"
    },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
```

### 15.3. `Inquiry.model.ts`

```ts
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: String,
    projectStage: {
      type: String,
      enum: ["idea", "protocolo", "analisis", "manuscrito", "revision"],
      required: true
    },
    objectiveType: {
      type: String,
      enum: ["causal", "predictivo", "descriptivo", "diagnostico", "pronostico", "mixto", "no_claro"],
      required: true
    },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "reviewed", "replied", "archived"], default: "new" },
    internalNotes: String
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
```

---

## 16. Middleware backend

### 16.1. Validación

```ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next({
        statusCode: 400,
        message: "Validation error",
        details: result.error.flatten()
      });
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
  };
}
```

### 16.2. Auth

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User.model";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies[env.cookieName];

    if (!token) {
      return next({ statusCode: 401, message: "Not authenticated" });
    }

    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    const user = await User.findById(payload.userId).select("-passwordHash");

    if (!user || user.status !== "active") {
      return next({ statusCode: 401, message: "Invalid user" });
    }

    (req as any).user = user;
    next();
  } catch {
    next({ statusCode: 401, message: "Invalid token" });
  }
}
```

### 16.3. Roles

```ts
import { Request, Response, NextFunction } from "express";

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return next({ statusCode: 403, message: "Forbidden" });
    }

    next();
  };
}
```

### 16.4. Error handler

```ts
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error",
    details: error.details || undefined
  });
}
```

---

## 17. Controladores principales

### 17.1. Login

```ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { env } from "../config/env";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.status !== "active") {
      return next({ statusCode: 401, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return next({ statusCode: 401, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    res.cookie(env.cookieName, token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}
```

### 17.2. Crear post

```ts
import { Request, Response, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";
import { Post } from "../models/Post.model";
import { slugify } from "../utils/slugify";

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const payload = req.body;

    const baseSlug = slugify(payload.title);
    const existing = await Post.findOne({ slug: baseSlug });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const post = await Post.create({
      ...payload,
      slug,
      content: sanitizeHtml(payload.content),
      authorId: user._id,
      publishedAt: payload.status === "published" ? new Date() : undefined
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}
```

### 17.3. Obtener posts públicos

```ts
import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post.model";

export async function getPublicPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, q } = req.query;

    const filter: any = { status: "published" };

    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { title: new RegExp(String(q), "i") },
        { excerpt: new RegExp(String(q), "i") },
        { tags: new RegExp(String(q), "i") }
      ];
    }

    const posts = await Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    next(error);
  }
}
```

---

## 18. Frontend

### 18.1. Cliente API

`src/services/apiClient.ts`

```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
```

### 18.2. Auth service

```ts
import { apiClient } from "./apiClient";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
}

export async function logout() {
  const { data } = await apiClient.post("/auth/logout");
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
```

### 18.3. Router

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { HomePage } from "../pages/public/HomePage";
import { AboutPage } from "../pages/public/AboutPage";
import { BlogListPage } from "../pages/public/BlogListPage";
import { BlogDetailPage } from "../pages/public/BlogDetailPage";
import { ContactPage } from "../pages/public/ContactPage";
import { LoginPage } from "../pages/admin/LoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminPostsPage } from "../pages/admin/AdminPostsPage";
import { AdminPostEditorPage } from "../pages/admin/AdminPostEditorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "sobre-mi", element: <AboutPage /> },
      { path: "blog", element: <BlogListPage /> },
      { path: "blog/:slug", element: <BlogDetailPage /> },
      { path: "contacto", element: <ContactPage /> }
    ]
  },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "posts", element: <AdminPostsPage /> },
      { path: "posts/new", element: <AdminPostEditorPage /> },
      { path: "posts/:id/edit", element: <AdminPostEditorPage /> }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### 18.4. ProtectedRoute

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
```

### 18.5. Layout público

Debe contener:

- Navbar superior.
- Logo/nombre.
- Enlaces:
  - Inicio.
  - Sobre mí.
  - Servicios.
  - Blog.
  - Noticias.
  - Recursos.
  - Contacto.
- Botón “Consulta metodológica”.
- Footer.

### 18.6. Layout privado

Debe contener:

- Sidebar plegable.
- Topbar.
- Indicador de usuario.
- Botón salir.
- Área de contenido.
- Navegación:
  - Dashboard.
  - Blog.
  - Noticias.
  - Recursos.
  - Servicios.
  - Consultas.
  - Ajustes.
  - Usuarios.

---

## 19. Componentes clave

### 19.1. PublicNavbar

Responsabilidades:

- Mostrar rutas públicas.
- Indicar página activa.
- Adaptarse a móvil.
- CTA contacto.

### 19.2. ArticleCard

Props:

```ts
interface ArticleCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  publishedAt?: string;
  coverImageUrl?: string;
}
```

Acción:

- Click navega a `/blog/:slug`.

### 19.3. BlogDetailPage

Debe:

- Leer `slug` de URL.
- Llamar a `GET /api/posts/:slug`.
- Mostrar:
  - título,
  - categoría,
  - fecha,
  - imagen,
  - contenido HTML sanitizado,
  - tags,
  - CTA a asesoría,
  - artículos relacionados.

### 19.4. PostEditorForm

Campos:

- Título.
- Extracto.
- Categoría.
- Tags.
- Imagen destacada.
- Contenido enriquecido.
- Estado.
- SEO title.
- SEO description.

Acciones:

- Guardar borrador.
- Publicar.
- Previsualizar.
- Cancelar.

### 19.5. AdminSidebar

Debe ser plegable.

Estados:

```ts
const [collapsed, setCollapsed] = useState(false);
```

Debe guardar preferencia en `localStorage`:

```ts
localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(collapsed));
```

---

## 20. Editor de contenido

Para producción se recomienda **TipTap** o **React Quill**.

### 20.1. Recomendación

Usar TipTap si se quiere mayor control y extensibilidad.

Instalación:

```bash
pnpm add @tiptap/react @tiptap/starter-kit
```

Uso básico:

```tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return <EditorContent editor={editor} />;
}
```

Regla importante:

- Sanitizar HTML en backend.
- No confiar en HTML del cliente.
- Renderizar contenido con cuidado.

---

## 21. Flujo de creación de post

### 21.1. Usuario interno

1. Entra en `/login`.
2. Introduce email y contraseña.
3. Backend crea cookie segura.
4. Frontend llama a `/auth/me`.
5. Usuario accede a `/admin`.
6. Entra en “Blog”.
7. Clica “Nuevo post”.
8. Rellena título, extracto, categoría, contenido.
9. Guarda como borrador o publica.
10. Backend valida y guarda.
11. Si está publicado, aparece en `/blog`.
12. Al hacer click, se abre `/blog/:slug`.

### 21.2. Reglas

- Un borrador no aparece en público.
- Un post publicado debe tener `publishedAt`.
- El slug debe ser único.
- El contenido debe estar sanitizado.
- El autor queda registrado.
- Cada cambio debe generar audit log.

---

## 22. Flujo de consulta pública

1. Usuario entra en `/contacto`.
2. Rellena formulario.
3. Frontend valida con Zod.
4. Envía a `POST /api/inquiries`.
5. Backend valida.
6. Guarda consulta.
7. Dashboard incrementa contador de consultas nuevas.
8. Admin entra en `/admin/inquiries`.
9. Lee consulta.
10. Cambia estado a revisada/respondida.
11. Añade nota interna.

---

## 23. Testing

### 23.1. Tipos de test

El proyecto debe incluir:

1. **Unit tests**
   - Funciones pequeñas.
   - Validadores.
   - Componentes aislados.

2. **Integration tests**
   - API con base de datos de test.
   - Login.
   - CRUD.
   - Publicación.

3. **E2E tests**
   - Flujo completo en navegador.
   - Login.
   - Crear post.
   - Ver post en público.
   - Enviar formulario.
   - Revisar consulta.

4. **Smoke tests**
   - La app carga.
   - API responde.
   - Base de datos conecta.

---

## 24. Tests backend

### 24.1. Test de auth

```ts
import request from "supertest";
import { app } from "../src/app";

describe("Auth", () => {
  it("rejects invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@test.com", password: "wrong" });

    expect(res.status).toBe(401);
  });
});
```

### 24.2. Test crear post protegido

```ts
describe("Admin posts", () => {
  it("does not allow creating posts without auth", async () => {
    const res = await request(app)
      .post("/api/admin/posts")
      .send({
        title: "Artículo de prueba",
        excerpt: "Extracto suficientemente largo para test",
        content: "Contenido suficientemente largo para poder validar correctamente.",
        category: "general"
      });

    expect(res.status).toBe(401);
  });
});
```

### 24.3. Test consulta pública

```ts
describe("Inquiries", () => {
  it("creates public inquiry", async () => {
    const res = await request(app)
      .post("/api/inquiries")
      .send({
        name: "Investigador Clínico",
        email: "test@example.com",
        projectStage: "protocolo",
        objectiveType: "causal",
        message: "Necesito ayuda para definir el estimando causal del estudio."
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("new");
  });
});
```

---

## 25. Tests frontend

### 25.1. Test ArticleCard

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ArticleCard } from "../components/public/ArticleCard";

test("renders article card", () => {
  render(
    <MemoryRouter>
      <ArticleCard
        title="Qué es un estimando causal"
        excerpt="Antes del modelo hay que definir el efecto."
        slug="estimando-causal"
        category="causalidad"
      />
    </MemoryRouter>
  );

  expect(screen.getByText("Qué es un estimando causal")).toBeInTheDocument();
});
```

### 25.2. Test ContactForm

```tsx
test("shows validation errors when empty", async () => {
  render(<ContactForm />);
  await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
  expect(await screen.findByText(/nombre/i)).toBeInTheDocument();
});
```

---

## 26. Tests E2E con Playwright

### 26.1. Instalar

```bash
pnpm add -D @playwright/test
pnpm exec playwright install
```

### 26.2. Test navegación pública

```ts
import { test, expect } from "@playwright/test";

test("public homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Eduardo Tebar Boti")).toBeVisible();
  await expect(page.getByRole("link", { name: /blog/i })).toBeVisible();
});
```

### 26.3. Test login admin

```ts
test("admin can login", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "admin@example.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/admin/);
});
```

### 26.4. Test publicar post

```ts
test("admin creates and publishes a post", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "admin@example.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.click('button[type="submit"]');

  await page.goto("/admin/posts/new");
  await page.fill('input[name="title"]', "Artículo E2E sobre calibración");
  await page.fill('textarea[name="excerpt"]', "La calibración es esencial en predicción clínica.");
  await page.selectOption('select[name="category"]', "prediccion");
  await page.fill('[data-testid="rich-editor"]', "Contenido completo del artículo sobre calibración.");
  await page.click('button:has-text("Publicar")');

  await page.goto("/blog");
  await expect(page.getByText("Artículo E2E sobre calibración")).toBeVisible();
});
```

---

## 27. GitHub Actions

### 27.1. CI general

Archivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  test-build:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install
        run: pnpm install

      - name: Test
        run: pnpm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          JWT_SECRET: test_secret

      - name: Build
        run: pnpm build
```

---

## 28. Despliegue

### 28.1. MongoDB Atlas

Pasos:

1. Crear cuenta en MongoDB Atlas.
2. Crear cluster gratuito.
3. Crear usuario de base de datos.
4. Permitir IP del proveedor backend o `0.0.0.0/0` temporalmente.
5. Obtener connection string.
6. Crear bases:
   - `eduardo_staging`
   - `eduardo_production`

### 28.2. Backend en Render

Pasos:

1. Subir repositorio a GitHub.
2. Crear nuevo Web Service en Render.
3. Conectar repositorio.
4. Root directory: `apps/api`.
5. Build command:

```bash
pnpm install && pnpm build
```

6. Start command:

```bash
pnpm start
```

7. Variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_ORIGIN=https://eduardotebarbotic.com
COOKIE_NAME=etb_session
```

8. Añadir healthcheck:

```txt
/api/health
```

### 28.3. Frontend en Vercel

Pasos:

1. Importar repositorio.
2. Root directory: `apps/web`.
3. Framework: Vite.
4. Build command:

```bash
pnpm build
```

5. Output directory:

```txt
dist
```

6. Variables:

```env
VITE_API_URL=https://api.eduardotebarbotic.com/api
VITE_APP_NAME=Eduardo Tebar Boti | Metodología Clínica
```

### 28.4. Dominio

Configurar:

```txt
eduardotebarbotic.com        -> frontend
www.eduardotebarbotic.com    -> frontend
api.eduardotebarbotic.com    -> backend
```

### 28.5. CORS producción

Backend:

```ts
app.use(cors({
  origin: ["https://eduardotebarbotic.com", "https://www.eduardotebarbotic.com"],
  credentials: true
}));
```

---

## 29. Docker Compose local

Archivo `docker-compose.yml`:

```yaml
services:
  mongo:
    image: mongo:7
    container_name: eduardo-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Uso:

```bash
docker compose up -d
```

---

## 30. Datos iniciales

### 30.1. Crear usuario admin

`src/seeds/seedAdmin.ts`:

```ts
import bcrypt from "bcrypt";
import { connectDB } from "../config/db";
import { User } from "../models/User.model";

async function seedAdmin() {
  await connectDB();

  const email = "admin@example.com";
  const password = "AdminPassword123!";

  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name: "Eduardo Tebar Boti",
    email,
    passwordHash,
    role: "admin",
    status: "active"
  });

  console.log("Admin created");
  process.exit(0);
}

seedAdmin();
```

Ejecutar:

```bash
pnpm --filter api seed:admin
```

### 30.2. Contenido inicial recomendado

Crear posts:

1. Asociación, causalidad y predicción.
2. Por qué un modelo multivariable no demuestra causalidad.
3. Qué es un estimando causal y por qué importa.
4. Cómo formular una pregunta causal clínicamente útil.
5. AUC no es suficiente: calibración y utilidad clínica.
6. Bootstrap frente a split-sample.
7. Cómo reportar un estudio observacional según STROBE.
8. Cómo preparar una consulta estadística antes de analizar los datos.

---

## 31. Diseño visual

### 31.1. Identidad

Estilo recomendado:

- Profesional.
- Clínico.
- Tecnológico.
- Académico.
- Elegante.
- Con estética de plataforma metodológica avanzada.

### 31.2. Colores

Propuesta:

```txt
Fondo principal: #08111f
Fondo secundario: #0f1b2d
Tarjetas: #111c2e
Texto principal: #f8fafc
Texto secundario: #cbd5e1
Azul acento: #38bdf8
Turquesa: #2dd4bf
Violeta: #8b5cf6
Verde éxito: #22c55e
Ámbar alerta: #f59e0b
Rojo error: #ef4444
```

### 31.3. Tipografía

Recomendación:

```txt
Inter
system-ui
```

### 31.4. Componentes visuales

- Cards con glassmorphism moderado.
- Gradientes suaves.
- Bordes finos.
- Iconografía Lucide.
- Microanimaciones Framer Motion.
- Gráficos Recharts.
- Sidebar admin plegable.
- Botones CTA claros.
- Tablas limpias.
- Estados vacíos bien diseñados.
- Feedback visual tras acciones.

---

## 32. Acciones completas por interfaz

### 32.1. Público — Inicio

Acciones:

- Navegar a servicios.
- Navegar a blog.
- Abrir artículo destacado.
- Enviar a contacto.
- Ver últimos posts.
- Ver recursos.

### 32.2. Público — Blog

Acciones:

- Buscar.
- Filtrar.
- Abrir artículo.
- Compartir URL.
- Navegar a contacto desde CTA.

### 32.3. Público — Detalle blog

Acciones:

- Leer artículo completo.
- Ver tags.
- Ver categoría.
- Ir a artículos relacionados.
- Solicitar asesoría.

### 32.4. Público — Servicios

Acciones:

- Ver servicios.
- Expandir detalle.
- Ir a formulario.

### 32.5. Público — Contacto

Acciones:

- Enviar formulario.
- Validar campos.
- Mostrar confirmación.
- Registrar consulta.

### 32.6. Privado — Dashboard

Acciones:

- Ver métricas.
- Acceder a creación rápida.
- Ver consultas nuevas.
- Ver actividad reciente.

### 32.7. Privado — Posts

Acciones:

- Crear.
- Editar.
- Eliminar.
- Publicar.
- Archivar.
- Buscar.
- Filtrar.
- Previsualizar.

### 32.8. Privado — Noticias

Acciones:

- Crear.
- Editar.
- Publicar.
- Archivar.
- Eliminar.
- Añadir fuente.

### 32.9. Privado — Recursos

Acciones:

- Crear.
- Subir documento.
- Publicar.
- Ocultar.
- Eliminar.

### 32.10. Privado — Consultas

Acciones:

- Abrir consulta.
- Añadir nota.
- Cambiar estado.
- Archivar.
- Filtrar.

### 32.11. Privado — Ajustes

Acciones:

- Editar hero.
- Editar sobre mí.
- Editar email.
- Editar enlaces.
- Guardar.
- Ver previsualización pública.

---

## 33. Criterios de aceptación

La aplicación estará lista para producción cuando se cumpla:

### 33.1. Público

- Inicio carga correctamente.
- Sobre mí muestra información correcta.
- Servicios se visualizan correctamente.
- Blog lista solo posts publicados.
- Detalle de post funciona por slug.
- Noticias funcionan.
- Recursos funcionan.
- Contacto crea consulta.
- Diseño responsive correcto.

### 33.2. Privado

- Login funciona.
- Logout funciona.
- Usuario no autenticado no entra a `/admin`.
- Admin crea post.
- Admin publica post.
- Post aparece en público.
- Admin crea noticia.
- Noticia aparece en público.
- Admin ve consultas recibidas.
- Admin cambia estados.
- Sidebar se pliega.
- Configuración pública se guarda.

### 33.3. Backend

- Todos los endpoints validan inputs.
- Los endpoints privados requieren auth.
- Borradores no salen en endpoints públicos.
- Slugs únicos.
- Passwords hasheadas.
- Cookies seguras.
- Logs básicos activos.
- Healthcheck responde.

### 33.4. Tests

- Tests unitarios pasan.
- Tests integración pasan.
- Tests E2E pasan.
- Build frontend pasa.
- Build backend pasa.
- CI pasa.

### 33.5. Seguridad

- No hay tokens en localStorage.
- No hay CORS abierto.
- No hay contraseñas planas.
- No se renderiza HTML sin sanitizar.
- Hay rate limit.
- Hay validación backend.
- Hay variables secretas fuera del repositorio.

---

## 34. Flujo de trabajo de desarrollo

### 34.1. Ramas

```txt
main        producción
develop     integración
feature/*   nuevas funciones
fix/*       correcciones
```

### 34.2. Flujo

1. Crear issue.
2. Crear rama `feature/nombre`.
3. Desarrollar.
4. Ejecutar tests.
5. Pull request a `develop`.
6. CI valida.
7. Revisar.
8. Merge.
9. Despliegue staging.
10. Validación manual.
11. Merge a `main`.
12. Despliegue producción.

---

## 35. Plan modular de construcción

### Módulo 1 — Base del proyecto

Objetivo:

- Crear monorepo.
- Configurar frontend.
- Configurar backend.
- Conectar MongoDB.
- Healthcheck.

Resultado:

- `GET /api/health` responde.
- Frontend carga.

Tests:

- API health.
- Frontend render básico.

### Módulo 2 — Autenticación

Objetivo:

- Modelo User.
- Login.
- Logout.
- `/auth/me`.
- ProtectedRoute.

Resultado:

- Admin puede iniciar sesión.
- `/admin` protegido.

Tests:

- Login incorrecto falla.
- Login correcto crea sesión.
- Ruta protegida bloquea no autenticados.

### Módulo 3 — Blog

Objetivo:

- Modelo Post.
- CRUD admin.
- Lista pública.
- Detalle público.

Resultado:

- Admin crea y publica posts.
- Público lee posts.

Tests:

- Borrador no se ve.
- Publicado se ve.
- Detalle slug funciona.

### Módulo 4 — Noticias

Objetivo:

- Modelo News.
- CRUD admin.
- Vista pública.

Resultado:

- Noticias dinámicas.

Tests:

- Crear noticia.
- Publicar noticia.
- Ver noticia.

### Módulo 5 — Servicios y recursos

Objetivo:

- CRUD servicios.
- CRUD recursos.
- Vista pública.

Resultado:

- Página servicios gestionable.
- Recursos publicados.

Tests:

- Servicio aparece público.
- Recurso aparece público.

### Módulo 6 — Consultas

Objetivo:

- Formulario público.
- Bandeja privada.
- Estados.
- Notas internas.

Resultado:

- Contacto real.

Tests:

- Enviar formulario.
- Ver consulta admin.
- Cambiar estado.

### Módulo 7 — Medios

Objetivo:

- Upload imágenes.
- Guardar URL.
- Usar en posts/noticias.

Resultado:

- Posts con imagen.

Tests:

- Rechazar archivo no permitido.
- Aceptar imagen válida.

### Módulo 8 — Ajustes

Objetivo:

- SiteSettings.
- Editar textos públicos.
- Guardar configuración.

Resultado:

- La home y sobre mí son editables desde admin.

Tests:

- Cambiar hero.
- Ver cambio en público.

### Módulo 9 — Testing E2E

Objetivo:

- Playwright.
- Flujos críticos.

Resultado:

- Validación navegador real.

Tests:

- Login.
- Crear post.
- Ver post público.
- Enviar consulta.

### Módulo 10 — Despliegue

Objetivo:

- Frontend en Vercel.
- Backend en Render.
- MongoDB Atlas.
- Variables.
- Dominio.

Resultado:

- Producción funcional.

Tests:

- Smoke tests producción.
- Healthcheck.
- Login.
- Crear contenido.
- Contacto.

---

## 36. Checklist antes de producción

### Código

- [ ] Sin errores TypeScript.
- [ ] Sin dependencias innecesarias.
- [ ] Sin console.log sensibles.
- [ ] Sin claves en repositorio.
- [ ] Build correcto.

### Seguridad

- [ ] JWT en cookie httpOnly.
- [ ] Passwords con bcrypt.
- [ ] CORS restringido.
- [ ] Helmet activo.
- [ ] Rate limit activo.
- [ ] Inputs validados.
- [ ] HTML sanitizado.
- [ ] Uploads restringidos.

### Datos

- [ ] MongoDB producción separado.
- [ ] Usuario admin creado.
- [ ] Backups definidos.
- [ ] Seed demo desactivado en producción.

### Frontend

- [ ] Responsive.
- [ ] Rutas públicas correctas.
- [ ] Rutas privadas protegidas.
- [ ] Estados loading/error.
- [ ] Formularios validados.
- [ ] SEO básico.

### Backend

- [ ] Healthcheck.
- [ ] Logs.
- [ ] Error handler.
- [ ] Endpoints privados protegidos.
- [ ] Endpoints públicos no exponen borradores.

### Tests

- [ ] Unitarios pasan.
- [ ] Integración pasa.
- [ ] E2E pasa.
- [ ] CI pasa.

### Despliegue

- [ ] Variables producción.
- [ ] Dominio configurado.
- [ ] HTTPS activo.
- [ ] CORS producción actualizado.
- [ ] Cookies funcionan cross-domain o mismo dominio.

---

## 37. Manual mínimo para el administrador

### 37.1. Entrar

1. Ir a `/login`.
2. Introducir email y contraseña.
3. Acceder a `/admin`.

### 37.2. Crear artículo

1. Ir a “Blog”.
2. Pulsar “Nuevo post”.
3. Escribir título.
4. Escribir extracto.
5. Seleccionar categoría.
6. Añadir contenido.
7. Subir imagen si procede.
8. Guardar borrador o publicar.

### 37.3. Crear noticia

1. Ir a “Noticias”.
2. Pulsar “Nueva noticia”.
3. Rellenar datos.
4. Añadir fuente si procede.
5. Publicar.

### 37.4. Revisar consultas

1. Ir a “Consultas”.
2. Abrir consulta.
3. Leer contenido.
4. Añadir nota interna.
5. Cambiar estado.

### 37.5. Editar página pública

1. Ir a “Ajustes”.
2. Cambiar texto hero o sobre mí.
3. Guardar.
4. Ir a la página pública para verificar.

---

## 38. Cómo migrar desde el HTML prototipo

### 38.1. Qué se conserva

Del prototipo se conserva:

- Estructura conceptual.
- Diferencia público/privado.
- Identidad visual.
- Textos iniciales.
- Flujo de blog.
- Flujo de editor.
- Flujo de servicios.
- Formulario de contacto.
- Sidebar plegable.

### 38.2. Qué cambia

El prototipo deja de usar:

- React desde CDN.
- Babel en navegador.
- Datos en localStorage como fuente principal.
- Rutas simuladas.

La versión real usa:

- React compilado con Vite.
- TypeScript.
- React Router.
- API Express.
- MongoDB.
- Autenticación real.
- Persistencia servidor.
- Tests.
- Despliegue.

### 38.3. Estrategia de migración

1. Extraer textos y contenidos del HTML.
2. Convertir componentes visuales en componentes React.
3. Crear rutas reales.
4. Crear API.
5. Sustituir localStorage por TanStack Query + backend.
6. Mantener localStorage solo para preferencias visuales:
   - sidebar plegado,
   - tema,
   - filtros temporales.
7. Crear seeds con contenido inicial.
8. Validar equivalencia visual.
9. Añadir seguridad y tests.
10. Desplegar.

---

## 39. Riesgos principales y mitigación

### Riesgo 1: complejidad excesiva inicial

Mitigación:

- Construir por módulos.
- No empezar por IA ni herramientas avanzadas.
- Primero: auth + blog + contacto.

### Riesgo 2: errores de seguridad en admin

Mitigación:

- JWT cookie httpOnly.
- Roles.
- Validación backend.
- Rate limit.
- CORS estricto.

### Riesgo 3: contenido HTML malicioso

Mitigación:

- Sanitización.
- CSP.
- Editor controlado.

### Riesgo 4: pérdida de datos

Mitigación:

- MongoDB Atlas.
- Backups.
- Exportaciones periódicas.
- No depender de localStorage.

### Riesgo 5: despliegue roto por variables

Mitigación:

- `.env.example`.
- Validación de env al arrancar.
- Documentación de variables.
- Healthcheck.

### Riesgo 6: diferencias staging/producción

Mitigación:

- Entornos separados.
- Bases separadas.
- Variables separadas.
- CI/CD.

---

## 40. Primera versión mínima viable

Para tener una primera versión real funcionando, construir:

1. Frontend Vite React.
2. Backend Express.
3. MongoDB Atlas.
4. Login admin.
5. CRUD posts.
6. Blog público.
7. Detalle de post.
8. Formulario de contacto.
9. Dashboard básico.
10. Despliegue.

No incluir al principio:

- Newsletter avanzada.
- Pagos.
- Multiusuario complejo.
- Analítica avanzada.
- IA.
- Automatizaciones.
- Comentarios públicos.

Esto reduce errores.

---

## 41. Versión 2

Añadir:

- Noticias.
- Recursos.
- Servicios editables.
- Subida de ficheros.
- Ajustes públicos.
- Estadísticas.
- Usuarios editor/admin.
- Logs de auditoría.

---

## 42. Versión 3

Añadir:

- Newsletter.
- Integración email.
- Descarga de plantillas.
- Buscador avanzado.
- Etiquetas complejas.
- SEO avanzado.
- Sitemap.
- RSS.
- Panel de métricas.
- Comentarios moderados si se desea.

---

## 43. Versión 4

Añadir:

- Herramientas interactivas.
- Checklist dinámica.
- Calculadora de eventos.
- Asistente de clasificación de pregunta.
- Plantilla de plan estadístico.
- Exportación PDF.
- Área privada para clientes si procede.

---

## 44. Conclusión técnica

La aplicación debe evolucionar desde un prototipo HTML visual a una arquitectura full-stack real.

La decisión más sencilla, robusta y menos propensa a errores para este proyecto es:

```txt
Frontend: React + Vite + TypeScript
Backend: Node + Express + TypeScript
Base de datos: MongoDB Atlas
Auth: JWT en cookies httpOnly
Medios: Cloudinary
Deploy frontend: Vercel o Netlify
Deploy backend: Render o Railway
Tests: Vitest + Testing Library + Supertest + Playwright
CI/CD: GitHub Actions
```

La prioridad no debe ser añadir muchas funciones desde el primer día, sino construir una base segura:

1. autenticación,
2. blog dinámico,
3. detalle público de artículos,
4. panel interno,
5. consultas,
6. tests,
7. despliegue.

Una vez esa base esté estable, se añaden noticias, recursos, servicios editables, plantillas, dashboards y herramientas.

El criterio de calidad del proyecto debe ser siempre el mismo que la tesis editorial del blog:

> cada parte debe estar alineada: objetivo, diseño, datos, acción, validación, seguridad, test y despliegue.

Cuando una persona técnica siga este documento, podrá construir una aplicación real equivalente al prototipo actual, pero con arquitectura profesional, persistencia en servidor, administración real, zona pública completa, pruebas automatizadas y despliegue en producción.
