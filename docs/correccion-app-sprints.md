# Correccion app por sprints

## Checklist global

1. Sprint 0: Diagnostico inicial, estructura del proyecto y logs base. Estado: Cerrado.
2. Sprint 1: Correccion de errores 401 y autenticacion. Estado: Cerrado.
3. Sprint 2: Correccion y simplificacion del blog. Estado: Cerrado.
4. Sprint 3: Subida y visualizacion de imagenes en blog. Estado: Cerrado.
5. Sprint 4: Limpieza de modulos no necesarios. Estado: Cerrado sin borrados.
6. Sprint 5: Modulo privado de formacion. Estado: Cerrado.
7. Sprint 6: Pagina publica de formacion. Estado: Cerrado.
8. Sprint 7: Login y permisos de acceso a formacion. Estado: Cerrado.
9. Sprint 8: Chat publico asociado a formacion. Estado: Cerrado.
10. Sprint 9: Panel privado de chat. Estado: Pendiente. No hay instrucciones detalladas en el prompt local.
11. Sprint 10: Filtros, metricas y seguimiento de chats. Estado: Pendiente. No hay instrucciones detalladas en el prompt local.
12. Sprint 11: Testeo integral en local. Estado: Pendiente.
13. Sprint 12: Build y despliegue. Estado: Pendiente.
14. Sprint 13: Testeo completo en produccion. Estado: Pendiente.
15. Sprint 14: Limpieza de datos de prueba. Estado: Pendiente.
16. Sprint 15: Informe final y checklist de aceptacion. Estado: Pendiente.

## Sprint 0: diagnostico inicial y logs base

Objetivo concreto: entender el proyecto y preparar trazas minimas de depuracion.

Requisitos funcionales: identificar frontend, backend, autenticacion, rutas, base de datos, subida de imagenes, scripts, Docker, Render/Vercel y variables necesarias.

Archivos afectados:

- `apps/api/src/app.ts`
- `apps/api/src/middleware/auth.middleware.ts`
- `apps/web/src/services/apiClient.ts`

Cambios realizados:

- Se confirmo que el frontend esta en `apps/web`, con React, Vite y TypeScript.
- Se confirmo que el backend esta en `apps/api`, con Express, TypeScript y MongoDB.
- Se confirmo que la autenticacion usa JWT y cookie `etb_session`.
- Se confirmo que las rutas privadas cuelgan de `/api/admin/*` y usan `requireAuth`.
- Se confirmo que las rutas publicas principales son `/api/posts`, `/api/news`, `/api/resources`, `/api/services`, `/api/settings/public` y `/api/inquiries`.
- Se confirmo que la subida de imagenes usa Cloudinary desde `apps/api/src/config/cloudinary.ts` y `apps/api/src/routes/media.routes.ts`.
- Se revisaron scripts de desarrollo, test y build en `package.json`.
- Se revisaron despliegues definidos en `render.yaml` y `vercel.json`.

Logs anadidos:

- Backend: warning cuando CORS bloquea un origen.
- Backend: warning cuando falta token, el usuario no es valido o el token no verifica.
- Frontend: logs de peticiones API en desarrollo y errores API no 401.

Pruebas realizadas:

- Lectura de estructura del repo.
- Lectura de rutas y middlewares de autenticacion.
- Lectura de scripts disponibles.

Resultado de las pruebas: diagnostico completado.

Errores detectados: el prompt local `PROMPT_AGENT_CORRECCION_APP.md` esta incompleto y termina dentro del Sprint 1.

Correcciones aplicadas: se documento el bloqueo de detalle para sprints 2-15 y se continuo con los sprints que si estaban definidos.

Confirmacion de cierre: Sprint 0 cerrado.

## Sprint 1: errores 401 y autenticacion

Objetivo concreto: corregir los errores 401 que bloquean el panel admin y la creacion de blogs.

Requisitos funcionales:

- Login funcional en frontend y backend.
- Peticiones admin autenticadas aunque el frontend y la API esten en dominios distintos.
- `/auth/me` sin sesion no debe dejar errores no controlados en consola de la app.

Archivos afectados:

- `apps/api/src/controllers/auth.controller.ts`
- `apps/api/src/middleware/auth.middleware.ts`
- `apps/api/src/app.ts`
- `apps/api/src/tests/auth.test.ts`
- `apps/web/src/services/apiClient.ts`
- `apps/web/src/services/authService.ts`
- `apps/web/src/hooks/useAuth.ts`

Cambios realizados:

- El login devuelve tambien el JWT como `token`.
- El frontend guarda el token en `localStorage`.
- El cliente API envia `Authorization: Bearer <token>` en cada request autenticada.
- El backend acepta token Bearer o cookie, manteniendo compatibilidad con el flujo anterior.
- En produccion la cookie de sesion se emite con `SameSite=None` y `Secure`.
- El logout limpia el token local incluso si la llamada remota falla.
- `/auth/me` responde como usuario nulo en cliente cuando recibe 401.

Logs anadidos:

- Trazas `auth.missing_token`, `auth.invalid_user` y `auth.invalid_token` en backend.
- Trazas `[api]` y `[api:error]` en frontend durante desarrollo.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/api run test`
- `npm --workspace @doctor-tebar/web run build`
- `npm --workspace @doctor-tebar/api run build`
- `npm run test`

Resultado de las pruebas:

- API tests: 4 archivos, 11 tests pasados.
- Test global: 5 archivos, 12 tests pasados.
- Web build: compilado correctamente.
- API build: compilado correctamente.

Errores detectados:

- La cookie `SameSite=Lax` puede no viajar entre dominios distintos en XHR/fetch.
- El cliente dependia solo de cookie para llamadas admin.

Correcciones aplicadas:

- Se anadio autenticacion Bearer como fallback principal para despliegues cross-site.
- Se ajusto cookie cross-site en produccion.

Confirmacion de cierre: Sprint 1 cerrado tras compilar y pasar tests locales.

## Sprint 2: correccion y simplificacion del blog

Objetivo concreto: hacer mas estable y directo el flujo de blog publico y privado.

Requisitos funcionales:

- El listado publico debe manejar carga, error y ausencia de articulos.
- El detalle publico debe manejar carga y error.
- El editor admin debe quedar centrado en crear/editar post sin controles accesorios que bloqueen el flujo.

Archivos afectados:

- `apps/web/src/pages/public/BlogListPage.tsx`
- `apps/web/src/pages/public/BlogDetailPage.tsx`
- `apps/web/src/components/public/ArticleCard.tsx`
- `apps/web/src/components/admin/PostEditorForm.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Se anadieron estados de carga, error y vacio al listado del blog.
- Se anadio estado de error al detalle del articulo.
- Se muestra imagen destacada en tarjeta y detalle cuando existe.
- Se simplifico el editor eliminando el bloque de checklist/distribucion y dejando el selector de estado visible.
- Se mantienen los campos esenciales: titulo, extracto, categoria, imagen, tags, contenido, SEO y estado.

Logs anadidos: se reutilizan los logs del cliente API del Sprint 0.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/web run build`
- `npm --workspace @doctor-tebar/web run test`

Resultado de las pruebas:

- Web build: compilado correctamente.
- Web tests: 1 test pasado.

Errores detectados: no se detectaron errores de compilacion ni tests.

Correcciones aplicadas: no fueron necesarias tras la verificacion.

Confirmacion de cierre: Sprint 2 cerrado.

## Sprint 3: subida y visualizacion de imagenes en blog

Objetivo concreto: permitir subir imagen destacada desde el propio editor de blog y verla correctamente en frontend.

Requisitos funcionales:

- El editor debe aceptar subida de imagen.
- La URL subida debe asignarse automaticamente al post.
- Debe existir previsualizacion antes de guardar.
- El blog publico debe mostrar la imagen destacada.

Archivos afectados:

- `apps/web/src/services/contentService.ts`
- `apps/web/src/components/admin/PostEditorForm.tsx`
- `apps/web/src/components/public/ArticleCard.tsx`
- `apps/web/src/pages/public/BlogDetailPage.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Se creo `uploadMedia(file)` contra `/admin/media/upload`.
- Se anadio input de archivo al editor de posts.
- La subida rellena `coverImageUrl` automaticamente.
- Se anadio preview de imagen destacada.
- Se bloquea guardar/publicar mientras hay una subida en curso.
- Se muestra error controlado si falla la subida.

Logs anadidos: se reutilizan logs de API del cliente y logs de autenticacion backend.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/web run build`
- `npm run test`

Resultado de las pruebas:

- Web build: compilado correctamente.
- Test global: 5 archivos, 12 tests pasados.

Errores detectados: no se detectaron errores de compilacion ni tests.

Correcciones aplicadas: no fueron necesarias tras la verificacion.

Confirmacion de cierre: Sprint 3 cerrado.

## Sprint 5: modulo privado de formacion

Objetivo concreto: crear un CRUD privado para gestionar formaciones desde el admin.

Requisitos funcionales:

- Modelo persistente de formacion.
- Rutas privadas admin para listar, crear, editar y borrar.
- Formulario privado en el panel admin.
- Navegacion admin hacia formacion.
- Pruebas y build de cierre.

Archivos afectados:

- `apps/api/src/models/TrainingCourse.model.ts`
- `apps/api/src/routes/training.routes.ts`
- `apps/api/src/schemas/content.schema.ts`
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

- Se creo `TrainingCourse`.
- Se creo `trainingCourseSchema`.
- Se anadieron rutas API `/api/admin/training`.
- Se anadieron rutas publicas base `/api/training`.
- Se anadio auditoria para entidad `training`.
- Se anadio tipo compartido `TrainingCourse`.
- Se creo formulario privado de formacion.
- Se conectaron rutas admin `/admin/training`, `/admin/training/new` y `/admin/training/:id/edit`.
- Se anadio enlace en sidebar y metrica en dashboard.

Logs anadidos: se reutilizan logs de autenticacion/API existentes.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/shared run build`
- `npm --workspace @doctor-tebar/api run build`
- `npm --workspace @doctor-tebar/web run build`
- `npm run test`

Resultado de las pruebas:

- Shared build: correcto.
- API build: correcto.
- Web build: correcto.
- Test global: 5 archivos, 13 tests pasados.

Errores detectados:

- Primer build API fallo por tipo amplio de `req.params.id`.
- Primer build web fallo porque el paquete shared no habia regenerado `dist`.

Correcciones aplicadas:

- Se normalizo `req.params.id` con `String(req.params.id)`.
- Se ejecuto build del workspace shared antes del build web.

Confirmacion de cierre: Sprint 5 cerrado.

## Sprint 6: pagina publica de formacion

Objetivo concreto: crear la experiencia publica de formacion usando las formaciones publicadas desde el admin.

Requisitos funcionales:

- Ruta publica de listado.
- Ruta publica de detalle.
- Estados de carga, error y vacio.
- Navegacion publica hacia formacion.
- Verificacion con build y tests.

Archivos afectados:

- `apps/web/src/pages/public/TrainingListPage.tsx`
- `apps/web/src/pages/public/TrainingDetailPage.tsx`
- `apps/web/src/router/AppRouter.tsx`
- `apps/web/src/components/public/PublicNavbar.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Se creo `/formacion`.
- Se creo `/formacion/:slug`.
- Se conecto `getTrainingCourses`.
- Se conecto `getTrainingCourse`.
- Se muestran nivel, acceso, duracion, precio, imagen y CTA.
- Se anadio enlace `Formacion` al menu publico.

Logs anadidos: se reutilizan logs de API del cliente.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/web run build`
- `npm --workspace @doctor-tebar/api run build`
- `npm run test`

Resultado de las pruebas:

- Web build: correcto.
- API build: correcto.
- Test global: 5 archivos, 13 tests pasados.

Errores detectados: no se detectaron errores de build ni tests.

Correcciones aplicadas: no fueron necesarias tras la verificacion.

Confirmacion de cierre: Sprint 6 cerrado.

## Sprint 7: login y permisos de acceso a formacion

Objetivo concreto: impedir que una formacion privada exponga su contenido completo sin sesion valida.

Requisitos funcionales:

- Las formaciones publicas deben verse sin login.
- Las formaciones privadas deben requerir sesion para ver el detalle completo.
- El listado publico no debe filtrar contenido sensible.
- El frontend debe mostrar una pantalla de acceso privado si falta sesion.
- Verificacion con build y tests.

Archivos afectados:

- `apps/api/src/middleware/auth.middleware.ts`
- `apps/api/src/routes/training.routes.ts`
- `apps/web/src/pages/public/TrainingDetailPage.tsx`
- `apps/web/src/styles/globals.css`

Cambios realizados:

- Se creo middleware `optionalAuth`.
- El listado `GET /api/training` excluye `description`.
- El detalle `GET /api/training/:slug` exige autenticacion si `access` es `private`.
- El frontend detecta 401 en detalle de formacion y muestra acciones de login/contacto.

Logs anadidos:

- `auth.optional_invalid_token` para tokens invalidos en rutas publicas con autenticacion opcional.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/api run build`
- `npm --workspace @doctor-tebar/web run build`
- `npm run test`

Resultado de las pruebas:

- API build: correcto.
- Web build: correcto.
- Test global: 5 archivos, 13 tests pasados.

Errores detectados: no se detectaron errores de build ni tests.

Correcciones aplicadas: no fueron necesarias tras la verificacion.

Confirmacion de cierre: Sprint 7 cerrado.

## Sprint 8: chat publico asociado a formacion

Objetivo concreto: permitir preguntas publicas asociadas a una formacion concreta.

Requisitos funcionales:

- Formulario publico en el detalle de formacion.
- Endpoint publico de envio.
- Persistencia de mensajes asociados a curso.
- Rate limit.
- Validacion frontend y backend.
- Verificacion con build y tests.

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

- Se creo `TrainingChatMessage`.
- Se creo `trainingChatMessageSchema`.
- Se anadio `POST /api/training/:slug/chat`.
- Se aplica `inquiryRateLimit`.
- Se creo `TrainingChatForm`.
- Se conecto el formulario en `/formacion/:slug`.
- Se anadio tipo compartido `TrainingChatMessage`.

Logs anadidos: se reutilizan logs de API del cliente y rate limit existente.

Pruebas realizadas:

- `npm --workspace @doctor-tebar/shared run build`
- `npm --workspace @doctor-tebar/api run build`
- `npm --workspace @doctor-tebar/web run build`
- `npm run test`

Resultado de las pruebas:

- Shared build: correcto.
- API build: correcto.
- Web build: correcto.
- Test global: 5 archivos, 14 tests pasados.

Errores detectados:

- Primer build web no detecto el tipo compartido nuevo hasta regenerar shared.

Correcciones aplicadas:

- Build de shared y repeticion de build web.

Confirmacion de cierre: Sprint 8 cerrado.
