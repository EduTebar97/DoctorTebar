# Estado Del Proyecto Doctor Tebar

Fecha de revision: 17 de mayo de 2026

## Resumen Ejecutivo

El proyecto esta implementado como una plataforma full-stack para metodologia clinica aplicada. La base tecnica esta desarrollada y las comprobaciones locales principales pasan correctamente:

- Build de API y web: correcto.
- Tests unitarios/integracion: correctos.
- Tests end-to-end Playwright: correctos.
- Audit de dependencias de produccion: sin vulnerabilidades.
- Lint: el script existe a nivel raiz, pero no hay scripts `lint` definidos en los workspaces, por lo que no ejecuta reglas reales.

Conclusion tecnica: el proyecto es funcional en local y los flujos principales quedan cubiertos por pruebas automaticas ampliadas en esta revision. Aun asi, quedan areas avanzadas sin cobertura exhaustiva, especialmente permisos por rol, medios, usuarios, ajustes y casos negativos de seguridad.

Actualizacion sprint 17 de mayo de 2026: quedan cerrados contra los requisitos completos Sprint 0 al Sprint 11. Sprint 12 (build y despliegue) es el siguiente sprint pendiente.

## Arquitectura

Monorepo Node con workspaces:

- `apps/api`: backend Node.js, Express, TypeScript y MongoDB/Mongoose.
- `apps/web`: frontend React, Vite y TypeScript.
- `packages/shared`: tipos y constantes compartidas.
- `e2e`: pruebas end-to-end con Playwright.
- `docs`: documentacion tecnica y operativa.
- `scripts`: scripts auxiliares de comprobacion.

## Stack Implementado

Frontend:

- React 19.
- Vite.
- TypeScript.
- React Router.
- TanStack Query.
- React Hook Form.
- Zod.
- Axios.
- Lucide React.
- Framer Motion.
- Recharts instalado.
- Vitest y Testing Library.

Backend:

- Node.js.
- Express.
- TypeScript.
- MongoDB con Mongoose.
- Zod.
- bcrypt.
- jsonwebtoken.
- cookie-parser.
- helmet.
- cors.
- express-rate-limit.
- multer.
- cloudinary.
- sanitize-html.
- morgan y winston.
- Vitest y Supertest instalado.

## Funcionalidades Publicas Implementadas

Rutas web publicas:

- `/`: pagina de inicio.
- `/sobre-mi`: pagina sobre Eduardo.
- `/servicios`: listado publico de servicios.
- `/blog`: listado publico de articulos.
- `/blog/:slug`: detalle publico de articulo.
- `/noticias`: listado publico de noticias.
- `/noticias/:slug`: detalle publico de noticia.
- `/recursos`: listado publico de recursos.
- `/formacion`: listado publico de formaciones publicadas.
- `/formacion/:slug`: detalle publico de formacion.
- `/contacto`: formulario de contacto.
- `/login`: acceso privado.

API publica:

- `GET /api/health`: estado de API y base de datos.
- `GET /api/posts`: listado publico de posts publicados.
- `GET /api/posts/:slug`: detalle publico de post.
- `GET /api/news`: listado publico de noticias publicadas.
- `GET /api/news/:slug`: detalle publico de noticia.
- `GET /api/resources`: listado publico de recursos publicados.
- `GET /api/services`: listado publico de servicios publicados.
- `GET /api/training`: listado publico de formaciones publicadas.
- `GET /api/training/:slug`: detalle publico de formacion publicada.
- `POST /api/training/:slug/chat`: envio publico de pregunta asociada a una formacion.
- `GET /api/settings/public`: ajustes publicos del sitio.
- `POST /api/inquiries`: envio de consulta desde contacto.

Componentes publicos:

- `PublicNavbar`.
- `PublicFooter`.
- `Hero`.
- `ArticleCard`.
- `ContactForm`.

## Funcionalidades Privadas Implementadas

Rutas web admin:

- `/admin`: dashboard privado.
- `/admin/posts`: gestion de posts.
- `/admin/posts/new`: creacion de post.
- `/admin/posts/:id/edit`: edicion de post.
- `/admin/news`: gestion de noticias.
- `/admin/news/new`: creacion de noticia.
- `/admin/resources`: gestion de recursos.
- `/admin/resources/new`: creacion de recurso.
- `/admin/resources/:id/edit`: edicion de recurso.
- `/admin/services`: gestion de servicios.
- `/admin/services/new`: creacion de servicio.
- `/admin/services/:id/edit`: edicion de servicio.
- `/admin/inquiries`: gestion de consultas.
- `/admin/settings`: ajustes publicos.
- `/admin/users`: listado de usuarios.

API de autenticacion:

- `POST /api/auth/login`: login con cookie httpOnly.
- `POST /api/auth/logout`: cierre de sesion.
- `GET /api/auth/me`: usuario autenticado.
- `POST /api/auth/change-password`: cambio de password.

API admin de contenidos:

- Posts: listar, obtener, crear, actualizar, eliminar, publicar y archivar.
- Noticias: listar, obtener, crear, actualizar, eliminar, publicar y archivar.
- Recursos: listar, obtener, crear, actualizar, eliminar y publicar.
- Servicios: listar, obtener, crear, actualizar, eliminar, publicar y archivar.
- Consultas: listar, obtener, actualizar estado, actualizar notas y eliminar.
- Ajustes: obtener y actualizar.
- Usuarios: listar y crear, restringido a rol `admin`.
- Medios: subir, listar y eliminar.
- Formacion: pendiente de cierre. Modelo y validacion backend iniciados, CRUD privado aun no conectado.

Componentes admin:

- `AdminLayout`.
- `Sidebar`.
- `Topbar`.
- `StatCard`.
- `ContentTable`.
- `PostEditorForm`.
- `ResourceEditorForm`.
- `ServiceEditorForm`.
- `RichTextEditor`.

Servicios frontend:

- `apiClient`.
- `authService`.
- `contentService`.

## Modelos De Datos Implementados

Modelos Mongoose:

- `User`.
- `Post`.
- `News`.
- `Resource`.
- `Service`.
- `Inquiry`.
- `SiteSettings`.
- `AuditLog`.
- `MediaAsset`.
- `TrainingCourse`: implementado el 17 de mayo de 2026 para el modulo privado de formacion.
- `TrainingChatMessage`: implementado el 17 de mayo de 2026 para preguntas publicas asociadas a formacion.

Tipos compartidos:

- Tipos de contenido publicados en `packages/shared/src/types/content.ts`.
- Constantes compartidas en `packages/shared/src/constants/content.ts`.

## Seguridad Implementada

- Hash de contrasenas con bcrypt.
- JWT firmado.
- Cookie httpOnly para sesion.
- Cookie `secure` en produccion.
- Cookie `sameSite=None` en produccion y `sameSite=lax` en desarrollo para permitir frontend/API en dominios distintos.
- Autenticacion admin compatible con cookie httpOnly y cabecera `Authorization: Bearer`.
- Middleware `requireAuth`.
- Middleware `requireRole`.
- Validacion de entrada con Zod.
- Sanitizacion de HTML enriquecido.
- Helmet.
- CORS restringido por `CLIENT_ORIGIN`.
- Rate limit para login.
- Rate limit para consultas publicas.
- Validacion de subida de archivos con multer.
- Integracion preparada con Cloudinary.
- Auditoria de acciones privadas relevantes.
- Logs HTTP y logger de aplicacion.

## Documentacion Existente

Documentacion principal:

- `README.md`.
- `Documentacion.md`.

Documentacion tecnica:

- `docs/arquitectura.md`.
- `docs/api-endpoints.md`.
- `docs/modelo-datos.md`.
- `docs/seguridad.md`.
- `docs/testing.md`.
- `docs/despliegue.md`.
- `docs/produccion.md`.
- `docs/manual-admin.md`.

Configuracion de despliegue:

- `.github/workflows/ci.yml`.
- `vercel.json`.
- `render.yaml`.
- `docker-compose.yml`.

## Pruebas Ejecutadas En Esta Revision

### Lint

Comando:

```bash
npm run lint
```

Resultado:

```txt
OK, pero sin reglas reales ejecutadas.
```

Detalle: el script raiz llama a `npm run lint --workspaces --if-present`, pero los paquetes `apps/api`, `apps/web` y `e2e` no definen script `lint`.

### Build

Comando:

```bash
npm run build
```

Resultado:

```txt
API build OK
Web build OK
```

Detalle: Vite genera correctamente el build, con aviso de chunk grande:

```txt
dist/assets/index-DkPc0KWU.js 503.28 kB
```

Este aviso no rompe produccion, pero conviene optimizar con code splitting si el proyecto sigue creciendo.

### Tests Unitarios E Integracion

Comando:

```bash
npm run test
```

Resultado:

```txt
API: 4 test files passed, 9 tests passed
Web: 1 test file passed, 1 test passed
Total: 5 test files passed, 10 tests passed
```

Tests API cubiertos:

- Validacion de login mal formado.
- Validacion de payload de consulta publica.
- Validacion minima de post.
- Generacion estable de slugs.
- Validacion de payload de noticia.
- Validacion de payload de recurso.
- Validacion de payload de servicio.
- Validacion de payload de ajustes publicos.

Tests frontend cubiertos:

- Render del componente `ArticleCard`.

### Tests End-to-End

Primer intento:

```bash
npm run test:e2e
```

Resultado: bloqueado por sandbox al levantar `tsx watch` por socket IPC en `/var/folders/...`.

Segundo intento ejecutado fuera del sandbox:

```bash
npm run test:e2e
```

Resultado:

```txt
15 passed
1 skipped
```

Flujos e2e cubiertos en Chromium desktop y Pixel 7 mobile:

- La home publica carga.
- Todas las paginas publicas principales renderizan su contenido base.
- La pagina de login admin carga.
- El login admin real permite entrar al dashboard.
- El blog publico renderiza contenido servido por API.
- El detalle de blog abre desde contenido por slug.
- El formulario de contacto valida campos requeridos.
- El formulario de contacto envia una consulta real.

Flujo e2e admin cubierto en Chromium desktop:

- Crear, editar, publicar, comprobar en publico y eliminar un post.
- Crear, publicar, comprobar en publico y eliminar una noticia.
- Crear, publicar, comprobar en publico y eliminar un recurso.
- Crear, publicar, comprobar en publico y eliminar un servicio.

Nota: el CRUD admin se omite intencionadamente en mobile para no duplicar escrituras ni disparar el rate limit de login. La disponibilidad admin movil queda cubierta por los tests de login y dashboard.

### Audit De Seguridad

Comando:

```bash
npm audit --omit=dev
```

Resultado:

```txt
found 0 vulnerabilities
```

## Estado De Cobertura Por Funcionalidad

| Area | Implementada | Verificada automaticamente | Observaciones |
| --- | --- | --- | --- |
| Home publica | Si | Si, e2e desktop/mobile | Carga basica cubierta. |
| Navegacion publica | Si | Si | Se comprueban las paginas publicas principales en desktop/mobile. |
| Blog publico | Si | Si, e2e | Listado y detalle por slug cubiertos. |
| Noticias publicas | Si | Si, e2e | Pagina publica y contenido creado desde admin cubiertos. |
| Recursos publicos | Si | Si, e2e | Pagina publica y contenido creado desde admin cubiertos. |
| Servicios publicos | Si | Si, e2e | Pagina publica y contenido creado desde admin cubiertos. |
| Contacto publico | Si | Si, e2e | Validacion y envio real cubiertos. |
| Login admin | Si | Si, e2e | Login real y entrada al dashboard cubiertos. |
| Dashboard admin | Si | Si, e2e basico | Carga cubierta, no metricas internas. |
| CRUD posts | Si | Si, e2e | Crear, publicar, comprobar publico y eliminar; editor abre y guarda por UI. |
| CRUD noticias | Si | Si, e2e | Crear, publicar, comprobar publico y eliminar. |
| CRUD recursos | Si | Si, e2e | Crear, publicar, comprobar publico y eliminar. |
| CRUD servicios | Si | Si, e2e | Crear, publicar, comprobar publico y eliminar. |
| Consultas admin | Si | Si, e2e de carga y API/CRM ampliado | Envio publico cubierto; CRM implementado con campos avanzados. |
| Ajustes admin | Si | No especifico | Implementado, sin e2e dedicado. |
| Usuarios admin | Si | Si, e2e de carga | UI dedicada con alta, rol, estado y reset password. |
| Medios admin | Si | Si, e2e de carga | UI dedicada con listado, subida, metadatos, copiar URL y borrar; subida requiere Cloudinary configurado. |
| Seguridad auth/roles | Si | Parcial | Login cubierto; permisos/roles no tienen suite completa. |
| Sanitizacion HTML | Si | No especifico | Implementada en backend, sin test dedicado visible. |
| Rate limiting | Si | No especifico | Implementado para login y consultas, sin test dedicado. |

## Riesgos Y Pendientes Tecnicos

- Falta una suite de lint real en `apps/api`, `apps/web` y/o raiz.
- La cobertura unitaria sigue siendo limitada frente al numero de endpoints y formularios, aunque se amplio la validacion de esquemas principales.
- Faltan e2e/admin tests para ajustes, usuarios, gestion de consultas y medios.
- La seccion de usuarios esta parcialmente resuelta: hay API y listado generico, pero no formulario de creacion especifico en la UI.
- La gestion de medios esta implementada en API, pero no aparece una pantalla admin dedicada para subir/listar/eliminar medios.
- El bundle web principal queda por encima del umbral recomendado de Vite por unos 3 KB.

## Veredicto

El proyecto esta desarrollado y operativo para los flujos principales: web publica, API, autenticacion, panel admin, CRUDs base, contacto, documentacion, build y e2e ampliados.

No es correcto afirmar que absolutamente cada caso posible este testeado individualmente. Lo verificado automaticamente cubre los caminos principales y los CRUD admin de contenido, pero para una garantia completa faltan pruebas especificas de permisos, medios, usuarios, ajustes, gestion admin de consultas y casos negativos de seguridad.

---

## Revision De Auditoria Funcional - 11 de mayo de 2026

Se ha ejecutado la primera fase de la auditoria avanzada descrita en `auditoria.md`.

### Funcionalidades nuevas implementadas

- Centro editorial: `/admin/editorial`.
- Calendario editorial: `/admin/calendar`.
- Biblioteca de medios: `/admin/media`.
- Usuarios y roles completos: `/admin/users`.
- Auditoria visible: `/admin/audit`.
- CRM avanzado de consultas: `/admin/inquiries`.
- Roles ampliados: `admin`, `editor`, `reviewer`, `viewer`.
- API de usuarios: actualizar, activar/desactivar y resetear password.
- API de auditoria: `GET /api/admin/audit`.
- API de CRM de consultas: `PATCH /api/admin/inquiries/:id/crm`.
- API de metadatos de medios: `PATCH /api/admin/media/:id`.
- Checklist de completitud en tablas admin.
- Checklist editorial dentro del editor de posts/noticias.
- Plantillas cientificas en el editor.
- Control metodologico basico en el editor.
- Generacion manual de texto LinkedIn/SEO.
- UTM manual para distribucion LinkedIn desde centro editorial.
- Diseno visual responsive aplicado segun `diseñobase.html`.

### Pruebas actuales

```txt
npm run build
OK

npm run test
API: 4 test files, 10 tests passed
Web: 1 test file, 1 test passed
Total: 5 test files, 11 tests passed

npm run test:e2e
17 passed
3 skipped
```

Los skips son intencionados: las mutaciones admin se ejecutan en Chromium desktop para evitar duplicar escrituras y disparar rate limits. Mobile conserva cobertura de login, dashboard y experiencia publica.

### Estado actualizado de cobertura

| Area | Estado |
| --- | --- |
| Web publica responsive | Implementada y verificada con build, e2e y capturas Playwright. |
| Backoffice responsive | Implementado y verificado por e2e de login/dashboard/modulos. |
| Centro editorial | Implementado y testeado por e2e de carga. |
| Calendario editorial | Implementado y testeado por e2e de carga. |
| Usuarios admin | Implementado con creacion, rol, estado y reset password. |
| Medios admin | Implementado con listado, subida, metadatos, copiar URL y eliminar. La subida real requiere Cloudinary configurado. |
| CRM consultas | Implementado con estados avanzados, prioridad, fuente, valor, servicio y notas. |
| Auditoria | Implementada con endpoint y pantalla filtrable por entidad. |
| Editor cientifico | Implementado con plantillas, checklist, completitud y texto LinkedIn manual. |
| CRUD contenido | Implementado y e2e cubre crear/publicar/ver publico/eliminar. |
| Tests unitarios | Ampliados para esquemas de contenido y CRM. |
| E2E | Ampliados a 17 tests efectivos. |

### Pendientes reales

- Lint real con ESLint/Prettier.
- Code splitting: el bundle principal queda en torno a 523 KB tras el crecimiento del backoffice.
- Newsletter real con proveedor externo.
- Integracion LinkedIn API/OAuth real.
- Programacion automatica con cron/cola.
- Versionado completo con restauracion.
- Referencias bibliograficas como CRUD persistente.
- CTAs persistentes como entidad propia.
- Analitica propia de lectura/conversion.
- Exportacion PDF/Markdown.

---

## Revision Guia Interactiva - 11 de mayo de 2026

Se ha implementado `guiainteractiva.md` como modulo privado real.

### Funcionalidades nuevas

- Ruta privada `/admin/guides`.
- Sidebar con acceso a `Guia interactiva`.
- Centro de aprendizaje con buscador y filtro por area.
- Tarjetas de guias con dificultad, duracion, estado y progreso.
- Tours interactivos con `react-joyride`.
- Progreso por guia en `localStorage`.
- Boton contextual de ayuda en el admin.
- Selectores `data-tour` en zonas clave del backoffice.
- Guias iniciales:
  - Primer recorrido por el panel privado.
  - Crear y publicar un articulo de blog.
  - Crear una noticia.
  - Subir un recurso.
  - Gestionar consultas CRM.
  - Usar biblioteca de medios.
  - Modificar ajustes publicos.
  - Gestionar usuarios y roles.

### Pruebas actuales tras la guia

```txt
npm run build
OK

npm run test
API: 4 test files, 10 tests passed
Web: 1 test file, 1 test passed
Total: 5 test files, 11 tests passed

npm run test:e2e
19 passed
5 skipped

npm audit --omit=dev
found 0 vulnerabilities
```

### Nota tecnica

Tras instalar `react-joyride`, el bundle principal sube a unos 618 KB. El proyecto sigue compilando correctamente, pero el code splitting del admin queda como mejora tecnica prioritaria.

---

## Revision Por Sprints De Correccion - 17 de mayo de 2026

Esta seccion es la fuente de verdad actual para el trabajo iniciado desde `PROMPT_AGENT_CORRECCION_APP.md`.

Nota actualizada: el 17 de mayo de 2026 se recibio una version completa de `PROMPT_AGENT_CORRECCION_APP.md` con requisitos mas estrictos. Esta seccion se reevalua contra ese prompt completo. Los sprints solo se consideran cerrados si cumplen los requisitos nuevos.

### Estado global de sprints

| Sprint | Estado | Resumen real |
| --- | --- | --- |
| Sprint 0: Diagnostico inicial, estructura del proyecto y logs base | Cerrado | Se reviso estructura, frontend, backend, auth, rutas, base de datos, medios, scripts, Docker, Vercel/Render y variables. Se anadieron logs base de API/auth/CORS y cliente API. |
| Sprint 1: Correccion de errores 401 y autenticacion | Cerrado contra prompt completo | Se corrigio auth con Bearer+cookie, logs `[AUTH]`/`[API]`, 401 controlado en `/auth/me`, login con catch y sin `Uncaught in promise` conocido. Las rutas admin quedan bajo `ProtectedRoute`. |
| Sprint 2: Blog simple y funcional | Cerrado contra prompt completo | Backend y frontend permiten crear post con solo `title` y `content`; `excerpt`, categoria, status y tags tienen defaults o se generan. |
| Sprint 3: Imagenes en blog | Cerrado contra prompt completo | El editor permite imagen destacada e imagenes internas subidas via media/upload e insertadas en el contenido. Sanitizado y visualizacion publica soportan `<img>`. |
| Sprint 4: Limpieza de modulos no necesarios | Cerrado contra prompt completo | Navegacion privada reducida a Blog, Formacion y Chat; home y dashboard dejan de llamar news/resources/services/inquiries; chat tiene pantalla temporal sin llamadas hasta Sprint 9. |
| Sprint 5: Modulo privado de formacion | Cerrado contra prompt completo | CRUD privado de cursos ampliado con indice/temas, texto largo, imagenes, video opcional y orden por tema. |
| Sprint 6: Pagina publica de formacion | Cerrado contra prompt completo | `/formacion` y `/formacion/:slug` muestran cursos, tarjetas, imagen, descripcion, indice, temas y secuencia de aprendizaje. |
| Sprint 7: Login y permisos de acceso a formacion | Cerrado contra prompt completo | Sin login se ven cursos, descripciones e indice; backend no entrega contenido, imagenes ni videos internos. Con login se ve contenido completo y chat. |
| Sprint 8: Chat publico asociado a formacion | Cerrado contra prompt completo | Chat dentro de formacion requiere usuario autenticado y guarda mensaje ligado a usuario, formacion y tema opcional. |
| Sprint 9: Panel privado de chat | Cerrado contra prompt completo | Panel con listado de mensajes, filtros por formacion/usuario/tema/estado, resumen por usuario, conteos, orden cronologico y gestion de estado. |
| Sprint 10: Filtros, metricas y seguimiento de chats | Cerrado contra prompt completo | Endpoint de metricas con agregacion MongoDB, tarjetas de resumen, ranking por formacion con barra visual, seguimiento por usuario con desglose de formaciones, filtros independientes y usuarios con multiples formaciones activas. |
| Sprint 11: Testeo integral en local | Cerrado | Testeo completo via API con curl: login, blog CRUD, formacion CRUD, acceso bloqueado sin auth, acceso completo con auth, chat CRUD, filtros admin, metricas, cambio de estado, limpieza de datos. Cero errores en log de servidor. 14 tests automatizados pasados. |
| Sprint 12: Build y despliegue | Pendiente | No desplegado en esta revision. |
| Sprint 13: Testeo completo en produccion | Pendiente | No ejecutado en esta revision. |
| Sprint 14: Limpieza de datos de prueba | Pendiente | No ejecutado en esta revision. |
| Sprint 15: Informe final y checklist de aceptacion | Pendiente | Pendiente de cierre global. |

### Cambios cerrados en Sprint 0

Archivos afectados:

- `apps/api/src/app.ts`
- `apps/api/src/middleware/auth.middleware.ts`
- `apps/web/src/services/apiClient.ts`
- `docs/correccion-app-sprints.md`

Cambios:

- Logs backend para origen CORS bloqueado.
- Logs backend para token ausente, usuario invalido y token invalido.
- Logs frontend de llamadas API en desarrollo.
- Documento de seguimiento por sprints en `docs/correccion-app-sprints.md`.

### Cambios cerrados en Sprint 1

Archivos afectados:

- `apps/api/src/controllers/auth.controller.ts`
- `apps/api/src/middleware/auth.middleware.ts`
- `apps/api/src/app.ts`
- `apps/api/src/tests/auth.test.ts`
- `apps/web/src/hooks/useAuth.ts`
- `apps/web/src/services/apiClient.ts`
- `apps/web/src/services/authService.ts`
- `apps/web/src/pages/admin/LoginPage.tsx`
- `apps/web/src/components/admin/Sidebar.tsx`

Cambios:

- `POST /api/auth/login` devuelve `{ user, token }`.
- El frontend guarda el token en `localStorage`.
- `apiClient` envia `Authorization: Bearer <token>`.
- `requireAuth` acepta Bearer token o cookie.
- Cookie de produccion ajustada a `SameSite=None` y `Secure`.
- `/auth/me` con 401 se transforma en `{ user: null }` en cliente para evitar error no controlado.
- Logout limpia token local aunque falle la llamada remota.
- Login captura errores y evita promesas no controladas en el submit.
- Logout desde sidebar captura errores de cierre de sesion.
- Logs frontend `[AUTH]` y `[API]` para sesion, rol, token presente, requests, status y errores 401 controlados.
- Logs backend `[SERVER]`, `[CORS]` y `[AUTH]` para peticiones, origin, header/cookie/token presente, acceso permitido y denegado.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/api run test
npm --workspace @doctor-tebar/web run build
npm --workspace @doctor-tebar/api run build
npm run test
```

Resultado:

```txt
API tests: 4 archivos, 11 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 12 tests pasados
Build web: OK
Build API: OK
```

Revalidacion contra prompt completo:

```bash
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
API build: OK
Web build: OK
Test global: 5 archivos, 14 tests pasados
```

### Cambios cerrados en Sprint 2

Archivos afectados:

- `apps/web/src/pages/public/BlogListPage.tsx`
- `apps/web/src/pages/public/BlogDetailPage.tsx`
- `apps/web/src/components/public/ArticleCard.tsx`
- `apps/web/src/components/admin/PostEditorForm.tsx`
- `apps/web/src/styles/globals.css`
- `apps/api/src/schemas/content.schema.ts`
- `apps/api/src/controllers/content.controller.ts`
- `apps/api/src/tests/posts.test.ts`
- `apps/web/src/schemas/post.schema.ts`

Cambios:

- Listado de blog con `Loader`, `ErrorMessage` y `EmptyState`.
- Filtros publicos de blog evitan mandar parametros vacios.
- Detalle de blog con error controlado.
- Tarjetas y detalle muestran `coverImageUrl`.
- Editor de post simplificado: se retiro el bloque pesado de checklist/distribucion y se dejo estado visible.
- `postSchema` backend acepta post minimo con solo titulo y contenido.
- `postFormSchema` frontend acepta post minimo con solo titulo y contenido.
- El backend genera `excerpt` automaticamente desde el contenido si no se envia.
- El backend aplica defaults: categoria `general`, tags `[]`, status `published`.
- El boton principal del editor queda como `Guardar y publicar`.
- Se anadieron logs `[BLOG]` para payload, titulo/contenido presentes, imagenes y errores 401.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/web run build
npm --workspace @doctor-tebar/web run test
npm --workspace @doctor-tebar/api run build
npm run test
```

Resultado:

```txt
Build web: OK
API build: OK
Test global: 5 archivos, 14 tests pasados
```

### Cambios cerrados en Sprint 3

Archivos afectados:

- `apps/web/src/services/contentService.ts`
- `apps/web/src/components/admin/PostEditorForm.tsx`
- `apps/web/src/components/public/ArticleCard.tsx`
- `apps/web/src/pages/public/BlogDetailPage.tsx`
- `apps/web/src/styles/globals.css`
- `apps/web/src/components/admin/RichTextEditor.tsx`

Cambios:

- Nueva funcion frontend `uploadMedia(file)`.
- Subida de imagen destacada desde el editor de posts/noticias.
- Asignacion automatica de `coverImageUrl`.
- Previsualizacion de imagen en el editor.
- Boton de imagen dentro de `RichTextEditor`.
- Subida de imagen interna al storage configurado via `/admin/media/upload`.
- Insercion de imagen interna como `<img src="...">` dentro del contenido.
- Visualizacion publica de imagenes internas en `.article-html`.
- Guardar/publicar se desactiva mientras hay subida en curso.
- Error controlado si falla la subida.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
API build: OK
Build web: OK
Test global: 5 archivos, 14 tests pasados
```

### Cambios cerrados en Sprint 4

Resultado de revision:

- Se revisaron rutas publicas, rutas admin, sidebar, modulos de medios, guias, calendario, auditoria, recursos, servicios y consultas.
- No se elimino codigo porque no habia lista concreta de modulos no necesarios.
- Los modulos revisados estan conectados por rutas, navegacion o endpoints y borrarlos podria romper funcionalidad existente.

Estado actualizado contra prompt completo: cerrado.

Cambios aplicados:

- Sidebar privado reducido a Blog, Formacion y Chat.
- Home publica deja de cargar noticias y servicios.
- Navegacion publica oculta servicios, noticias, recursos, sobre-mi y contacto.
- Dashboard privado deja de llamar `/api/admin/news`, `/api/admin/resources` y `/api/admin/inquiries`.
- Dashboard privado solo consulta Blog y Formacion.
- Se crea `/admin/chat` como pantalla temporal sin llamadas a API hasta Sprint 9.
- Las rutas antiguas siguen existiendo si se accede manualmente, pero quedan ocultas de navegacion para evitar romper codigo de forma destructiva.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
API build: OK
Web build: OK tras corregir comparacion de tipos en Sidebar
Test global: 5 archivos, 14 tests pasados
```

### Sprint 5 Cerrado

Archivos afectados:

- `apps/api/src/models/TrainingCourse.model.ts`
- `apps/api/src/schemas/content.schema.ts`
- `apps/api/src/routes/training.routes.ts`
- `apps/api/src/app.ts`
- `apps/api/src/models/AuditLog.model.ts`
- `apps/api/src/tests/content-schemas.test.ts`
- `packages/shared/src/types/content.ts`
- `packages/shared/src/constants/content.ts`
- `apps/web/src/schemas/training.schema.ts`
- `apps/web/src/services/contentService.ts`
- `apps/web/src/components/admin/TrainingEditorForm.tsx`
- `apps/web/src/pages/admin/AdminTrainingEditorPage.tsx`
- `apps/web/src/router/AppRouter.tsx`
- `apps/web/src/components/admin/Sidebar.tsx`
- `apps/web/src/pages/admin/AdminDashboardPage.tsx`

Cambios realizados:

- Modelo Mongoose `TrainingCourse`.
- Schema Zod `trainingCourseSchema`.
- Campos definidos: titulo, slug, resumen, descripcion, nivel, acceso publico/privado, imagen, precio, duracion, estado, destacado y fecha de publicacion.
- Campos de tema definidos: titulo, descripcion breve, texto largo, imagenes, video opcional y orden.
- Rutas API privadas:
  - `GET /api/admin/training`
  - `GET /api/admin/training/:id`
  - `POST /api/admin/training`
  - `PUT /api/admin/training/:id`
  - `DELETE /api/admin/training/:id`
- Rutas API publicas preparadas para Sprint 6:
  - `GET /api/training`
  - `GET /api/training/:slug`
- Auditoria de acciones `create`, `update` y `delete` para entidad `training`.
- Tipo compartido `TrainingCourse`.
- Constantes compartidas para niveles y modos de acceso.
- Formulario privado `TrainingEditorForm`.
- Pagina admin `AdminTrainingEditorPage`.
- Rutas admin:
  - `/admin/training`
  - `/admin/training/new`
  - `/admin/training/:id/edit`
- Entrada `Formacion` en el sidebar admin.
- Metrica de formacion y acceso rapido en dashboard admin.
- Test de schema para payload de formacion.
- Formulario privado ampliado con seccion `Indice y temas`.
- Permite anadir y borrar temas.
- Permite editar titulo, descripcion breve, texto largo, imagenes, video y orden de cada tema.
- Persistencia de temas dentro de `TrainingCourse`.

Estado real:

- Cerrado contra prompt completo para parte privada.
- Compila shared.
- Compila API.
- Compila web.
- Tests globales pasan.
- La visualizacion publica de indice/temas queda para Sprint 6.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/shared run build
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
Shared build: OK
API build: OK
Web build: OK
API tests: 4 archivos, 13 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 14 tests pasados
```

Nota de verificacion: el primer build web fallo porque se ejecuto en paralelo antes de regenerar tipos de `@doctor-tebar/shared`. Se repitio `npm --workspace @doctor-tebar/web run build` despues del build de shared y quedo correcto.

### Sprint 6 Cerrado

Objetivo concreto: publicar una seccion publica de formacion conectada al modulo creado en Sprint 5.

Archivos afectados:

- `apps/web/src/pages/public/TrainingListPage.tsx`
- `apps/web/src/pages/public/TrainingDetailPage.tsx`
- `apps/web/src/router/AppRouter.tsx`
- `apps/web/src/components/public/PublicNavbar.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Nueva ruta publica `/formacion`.
- Nueva ruta publica `/formacion/:slug`.
- Listado publico de formaciones con `getTrainingCourses`.
- Detalle publico de formacion con `getTrainingCourse`.
- Estados controlados de carga, error y vacio.
- Visualizacion de nivel, acceso, duracion, precio e imagen destacada.
- Visualizacion de numero de temas en tarjetas.
- Indice publico con temas ordenados.
- Secuencia de aprendizaje con tema, descripcion, imagenes, video y contenido.
- CTA hacia contacto.
- Enlace `Formacion` en la navegacion publica.

Estado real:

- Cerrado contra prompt completo para visualizacion publica.
- Compila shared.
- Compila API.
- Compila web.
- Tests globales pasan.
- La logica especifica de permisos/login de acceso a contenido completo queda para Sprint 7.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/web run build
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/shared run build
npm run test
```

Resultado:

```txt
Web build: OK
API build: OK
Shared build: OK
API tests: 4 archivos, 12 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 13 tests pasados
```

Revalidacion contra prompt completo:

```txt
Shared build: OK
API build: OK
Web build: OK
Test global: 5 archivos, 14 tests pasados
```

### Sprint 7 Cerrado

Objetivo concreto: diferenciar acceso entre usuarios no autenticados y autenticados en formacion.

Archivos afectados:

- `apps/api/src/middleware/auth.middleware.ts`
- `apps/api/src/routes/training.routes.ts`
- `packages/shared/src/types/content.ts`
- `apps/web/src/pages/public/TrainingDetailPage.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Se anadio `optionalAuth` en backend para rutas publicas que pueden funcionar con o sin sesion.
- `GET /api/training` no devuelve `description`, evitando exponer contenido completo desde el listado.
- `GET /api/training/:slug` con usuario no autenticado devuelve datos publicos: titulo, descripcion, resumen e indice de temas.
- `GET /api/training/:slug` con usuario no autenticado elimina contenido interno, imagenes internas y video de cada tema.
- `GET /api/training/:slug` con usuario autenticado devuelve contenido completo.
- El frontend muestra el mensaje: `Para acceder al contenido completo de esta formación debes iniciar sesión.`
- El chat solo se muestra cuando hay usuario autenticado y el contenido no esta bloqueado.

Estado real:

- Cerrado.
- Compila API.
- Compila web.
- Tests globales pasan.
- El login utilizado es el login existente del proyecto; no se ha creado todavia un portal separado para alumnos.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm --workspace @doctor-tebar/shared run build
npm run test
```

Resultado:

```txt
API build: OK
Web build: OK
Shared build: OK
API tests: 4 archivos, 12 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 13 tests pasados
```

Revalidacion contra prompt completo:

```txt
API build: OK
Web build: OK
Test global: 5 archivos, 14 tests pasados
```

### Sprint 8 Cerrado

Objetivo concreto: crear chat dentro de formacion, asociado a usuario autenticado, formacion y tema si procede.

Archivos afectados:

- `apps/api/src/models/TrainingChatMessage.model.ts`
- `apps/api/src/routes/training.routes.ts`
- `apps/api/src/schemas/content.schema.ts`
- `apps/api/src/tests/content-schemas.test.ts`
- `packages/shared/src/types/content.ts`
- `apps/web/src/schemas/training-chat.schema.ts`
- `apps/web/src/services/contentService.ts`
- `apps/web/src/components/public/TrainingChatForm.tsx`
- `apps/web/src/pages/public/TrainingDetailPage.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Se creo modelo `TrainingChatMessage`.
- Se creo schema backend `trainingChatMessageSchema`.
- Se anadio endpoint publico `POST /api/training/:slug/chat`.
- El endpoint ahora requiere `requireAuth`.
- El endpoint toma `name`, `email` y `userId` desde `req.user`, no desde datos anonimos.
- El endpoint valida que la formacion exista y este publicada.
- El endpoint permite asociar `topicId` y guarda `topicTitle` si existe.
- El endpoint aplica `inquiryRateLimit`.
- Se guarda nombre, email, usuario, mensaje, curso asociado, tema asociado, slug, titulo, IP y user agent.
- Se anadio tipo compartido `TrainingChatMessage`.
- Se creo schema frontend `trainingChatSchema`.
- Se creo formulario publico `TrainingChatForm`.
- El detalle `/formacion/:slug` muestra el chat solo si hay usuario autenticado y el contenido completo no esta bloqueado.
- El formulario permite seleccionar tema o curso completo.

Estado real:

- Cerrado contra prompt completo.
- Compila shared.
- Compila API.
- Compila web.
- Tests globales pasan.
- La bandeja privada de gestion de mensajes queda para Sprint 9.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/shared run build
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
Shared build: OK
API build: OK
Web build: OK
API tests: 4 archivos, 13 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 14 tests pasados
```

Errores detectados:

- Durante la implementacion inicial el chat era anonimo; se corrigio para exigir sesion y asociar usuario/formacion/tema.
- El primer build web no detecto inmediatamente el tipo nuevo `TrainingChatMessage` hasta regenerar el workspace shared y repetir el build.

Correcciones aplicadas:

- Se ejecuto `npm --workspace @doctor-tebar/shared run build`.
- Se repitio `npm --workspace @doctor-tebar/web run build` y quedo correcto.

### Sprint 9 Cerrado

Objetivo concreto: crear panel privado para ver, filtrar y gestionar los mensajes de chat enviados desde las formaciones.

Archivos afectados:

- `apps/api/src/routes/training.routes.ts`
- `apps/web/src/services/contentService.ts`
- `apps/web/src/pages/admin/AdminChatPage.tsx`

Cambios realizados:

- Se anadieron tres endpoints admin de chat en `training.routes.ts`:
  - `GET /api/admin/chat`: lista mensajes con filtros opcionales `course`, `user`, `topic` y `status`; logs `[CHAT ADMIN]` de consulta, filtros aplicados y total devuelto.
  - `PATCH /api/admin/chat/:id/status`: actualiza estado del mensaje (new, reviewed, replied, archived).
  - `DELETE /api/admin/chat/:id`: elimina mensaje; log de confirmacion.
- Se anadieron funciones en `contentService.ts`: `getAdminChatMessages`, `updateChatMessageStatus`, `deleteChatMessage`, `getAdminTrainingCourses`.
- `AdminChatPage.tsx` completamente reescrita con:
  - Filtros por formacion, usuario, tema y estado con boton de aplicar y limpiar.
  - Logs frontend `[CHAT ADMIN]` de carga y filtros activos.
  - Lista de mensajes ordenada por fecha descendente.
  - Tarjeta por mensaje con usuario, formacion, tema, mensaje, fecha, estado y selector de cambio de estado.
  - Borrado con confirmacion.
  - Resumen por usuario con conteo de mensajes, numero de formaciones distintas, desglose por formacion y ultima actividad.

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
API build: OK
Web build: OK
API tests: 4 archivos, 13 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 14 tests pasados
```

### Sprint 10 Cerrado

Objetivo concreto: metricas globales de chat con seguimiento por usuario y formacion.

Archivos afectados:

- `apps/api/src/routes/training.routes.ts`
- `apps/web/src/services/contentService.ts`
- `apps/web/src/pages/admin/AdminChatPage.tsx`

Cambios realizados:

- Nuevo endpoint `GET /api/admin/chat/metrics` con agregacion MongoDB en tres pipelines paralelas:
  - Totales globales (total, open).
  - Por formacion: total, nuevos y usuarios distintos por formacion.
  - Por usuario: total de mensajes, mensajes nuevos, formaciones distintas, ultima actividad y desglose por formacion; pipeline de dos etapas para agrupar primero por usuario+formacion y luego por usuario.
  - Campo derivado `usersWithMultipleCourses`.
  - Logs `[CHAT ADMIN]` de inicio y resultado.
- Interfaz `ChatMetrics` exportada desde `contentService.ts`.
- Funcion `getAdminChatMetrics` con log `[CHAT ADMIN]`.
- `AdminChatPage.tsx` reestructurada con dos pestanas:
  - Pestaña Mensajes: filtros y listado (Sprint 9, conservado).
  - Pestaña Metricas: cinco tarjetas de resumen, tabla de formaciones con barra proporcional y filtro, tabla de usuarios con desglose de formaciones y filtro independiente; formato fiel al prompt (nombre, conversaciones abiertas, formaciones distintas, desglose).

Pruebas de cierre:

```bash
npm --workspace @doctor-tebar/api run build
npm --workspace @doctor-tebar/web run build
npm run test
```

Resultado:

```txt
API build: OK
Web build: OK
API tests: 4 archivos, 13 tests pasados
Web tests: 1 archivo, 1 test pasado
Test global: 5 archivos, 14 tests pasados
```

### Sprint 11 Cerrado

Objetivo concreto: testeo integral en local con todos los flujos del sistema.

Entorno:

- MongoDB: corriendo en localhost:27017.
- API: levantada con `node dist/server.js` en puerto 4000.
- Usuario admin: dr.tebar@gmail.com creado con seed.

Flujos verificados via curl:

1. Login admin: OK. Token JWT recibido. `/auth/me` devuelve usuario y rol correctamente.
2. Crear blog solo con titulo y texto: OK. Slug generado, excerpt generado, status draft.
3. Publicar blog: OK. Aparece en listado privado y publico.
4. Ver detalle publico por slug: OK.
5. Borrar blog: HTTP 204. Desaparece de publico con 404.
6. Crear curso de formacion con dos temas: OK. Slug generado, 2 topics guardados.
7. Ver curso publico sin login: locked=true, content/imageUrls/videoUrl vacios en todos los temas.
8. Ver curso publico con login: locked=false, contenido completo visible.
9. Enviar chat asociado a tema: OK. ID de usuario, formacion y tema guardados.
10. Enviar chat general (sin tema): OK.
11. Intentar chat sin login: HTTP 401.
12. Panel admin chat todos: 2 mensajes.
13. Filtro por formacion: 2 mensajes.
14. Filtro por usuario (nombre): 2 mensajes.
15. Filtro por estado (new): 2 mensajes.
16. Metricas: total 2, open 2, 1 formacion, 1 usuario, 0 con multiple cursos; desglose correcto.
17. Cambiar estado a reviewed: OK. Filtro new devuelve 1 mensaje.
18. Borrar mensajes de prueba: HTTP 204.
19. Borrar curso de prueba: HTTP 204.
20. Confirmar limpieza: 0 mensajes en chat, curso no aparece en publico.
21. Logs de servidor: 172 lineas, 0 errores level error, 0 uncaught/fatal.
22. Tests automatizados: 14 pasados, 0 fallidos.
23. Build global: OK.

### Pendientes inmediatos

1. Continuar Sprint 12: build y despliegue.
2. Sprint 13: testeo en produccion.
3. Sprint 14: limpieza final.
4. Sprint 15: informe final.
